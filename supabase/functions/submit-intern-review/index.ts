import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { caseId, notes, corrections, isDraft } = await req.json();

    if (!caseId) {
      throw new Error('Missing caseId');
    }

    // Verify the case is assigned to this intern
    const { data: caseData, error: caseError } = await supabase
      .from('ai_reports')
      .select('assigned_intern_id, status')
      .eq('id', caseId)
      .single();

    if (caseError) throw caseError;

    if (caseData.assigned_intern_id !== user.id) {
      throw new Error('You are not assigned to this case');
    }

    if (caseData.status !== 'assigned_intern') {
      throw new Error('Case is not in the correct status for intern review');
    }

    // Upsert intern review
    const { error: reviewError } = await supabase
      .from('intern_reviews')
      .upsert({
        report_id: caseId,
        intern_id: user.id,
        notes: notes || null,
        corrections: corrections || null,
        status: isDraft ? 'draft' : 'submitted',
        forwarded_to_doctor: !isDraft,
        verified_at: isDraft ? null : new Date().toISOString()
      }, {
        onConflict: 'report_id,intern_id'
      });

    if (reviewError) throw reviewError;

    // If submitting (not draft), update case status
    if (!isDraft) {
      const { error: updateError } = await supabase
        .from('ai_reports')
        .update({
          status: 'pending_doctor',
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (updateError) throw updateError;

      // Insert audit log
      const { error: auditError } = await supabase
        .from('case_audit_logs')
        .insert({
          case_id: caseId,
          user_id: user.id,
          action: 'intern_submitted',
          details: { timestamp: new Date().toISOString() }
        });

      if (auditError) console.error('Audit log error:', auditError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: isDraft ? 'Draft saved successfully' : 'Review submitted successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error submitting intern review:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});