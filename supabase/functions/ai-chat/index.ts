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
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing message or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get Supabase client to fetch chat history
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch recent chat history
    const { data: chatHistory } = await supabase
      .from('ai_chat_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(10);

    // Save user message
    await supabase.from('ai_chat_messages').insert({
      user_id: userId,
      role: 'user',
      content: message,
    });

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: 'Act as the Jeevan Setu AI Health Assistant. Your function is strictly limited to providing compassionate, actionable triage guidance, NOT diagnosis or prescription. Your response must be extremely concise, professional, and limited to a MAXIMUM of 5 sentences total. You must structure your entire output into THREE distinct, labeled sections: *Urgency:* (identify red flags requiring immediate attention), *Immediate Home Care:* (practical steps they can take now), and *Next Action:* (recommend using Jeevan Setu Symptom Checker and booking consultation if needed). Do not include excessive bullet points, bolding, or generic medical information. Focus on the user\'s specific input. Always start with "Thank you for reaching out. Please remember I cannot provide a diagnosis, only guidance." End with "We hope you feel better soon."',
      },
      ...(chatHistory || []),
      { role: 'user', content: message },
    ];

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
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
    const assistantMessage = data.choices[0].message.content;

    // Save assistant message
    await supabase.from('ai_chat_messages').insert({
      user_id: userId,
      role: 'assistant',
      content: assistantMessage,
    });

    // Determine if this is a medical symptom query that should create an AI report
    const isMedicalQuery = message.toLowerCase().match(/(pain|fever|symptom|sick|hurt|ache|dizzy|nausea|vomit|cough|cancer|tumor|lump|bleeding|swelling)/);
    
    let reportInfo = null;
    if (isMedicalQuery) {
      // Generate a prediction based on the conversation
      const predictionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'Based on the patient symptoms, provide a brief medical assessment in 2-3 sentences. Include potential conditions to investigate and urgency level. Be professional and cautious.',
            },
            { role: 'user', content: `Patient reported: ${message}` },
          ],
        }),
      });
      
      if (predictionResponse.ok) {
        const predictionData = await predictionResponse.json();
        const prediction = predictionData.choices[0].message.content;
        
        reportInfo = {
          createReport: true,
          prediction,
          confidence: 0.75,
        };
      }
    }

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        ...reportInfo 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
