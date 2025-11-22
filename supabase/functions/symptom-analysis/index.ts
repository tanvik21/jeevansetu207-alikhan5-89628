import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, userId } = await req.json();
    
    if (!symptoms || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing symptoms or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing symptoms for user:', userId);

    // Medical AI analysis with proper prompt
    const systemPrompt = `You are a verified medical AI assistant within the Jeevan Setu healthcare platform. 
Your role is to analyze a user's reported symptoms and provide a reasoned, dynamic differential diagnosis. 
The output must be fully based on the input symptoms, with probabilities adjusted logically — no default or fixed percentages.

Instructions:
1. Carefully parse the input symptoms, noting duration, severity, pattern, and key clinical features.
2. Consider likely conditions based on Indian epidemiology.
3. Rank the top 5 possible conditions by probability. Ensure probabilities total 100% and vary per input.
4. Provide a concise reasoning for each condition.
5. Highlight if urgent medical attention is required.
6. Suggest next steps based on severity: Home care, Consult doctor, or Visit ER.
7. Format the output exactly as shown below.

Output Format:

**Likely Diagnoses**
1. [Condition Name] – [Probability %]
   Reason: [Brief reasoning]
2. [Condition Name] – [Probability %]
   Reason: [Brief reasoning]
3. [Condition Name] – [Probability %]
   Reason: [Brief reasoning]
4. [Condition Name] – [Probability %]
   Reason: [Brief reasoning]
5. [Condition Name] – [Probability %]
   Reason: [Brief reasoning]

**Urgency Level:** [Low / Moderate / High]
**Suggested Next Step:** [Home care / Consult doctor / Visit ER]

CRITICAL: Ensure probabilities are dynamic and based on the specific symptoms, not fixed percentages.`;

    // Call Lovable AI for differential diagnosis
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `User Symptoms: ${symptoms}` }
        ],
        temperature: 0.8, // Allow for reasoning and variability
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service quota exceeded. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI Gateway error');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Analysis completed successfully');

    // Create AI report in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: reportData, error: reportError } = await supabase
      .from('ai_reports')
      .insert({
        patient_id: userId,
        symptoms: symptoms,
        ai_prediction: analysis,
        confidence_score: 0.85,
        status: 'pending_intern'
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating AI report:', reportError);
      throw new Error('Failed to create AI report');
    }

    console.log('AI report created with ID:', reportData.id);

    // Create audit log for case creation
    const { error: auditError } = await supabase
      .from('case_audit_logs')
      .insert({
        case_id: reportData.id,
        user_id: userId,
        action: 'created_by_ai',
        details: { 
          timestamp: new Date().toISOString(),
          symptoms: symptoms.substring(0, 100)
        }
      });

    if (auditError) {
      console.error('Audit log error:', auditError);
    }

    return new Response(
      JSON.stringify({ 
        analysis,
        reportId: reportData.id,
        message: 'Analysis complete and report created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in symptom-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
