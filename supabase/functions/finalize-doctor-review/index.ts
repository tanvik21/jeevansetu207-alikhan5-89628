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

    const { caseId, verifiedSummary, feedback, prescription } = await req.json();

    if (!caseId || !verifiedSummary) {
      throw new Error('Missing required fields');
    }

    // Verify the case is assigned to this doctor
    const { data: caseData, error: caseError } = await supabase
      .from('ai_reports')
      .select('assigned_doctor_id, status, patient_id')
      .eq('id', caseId)
      .single();

    if (caseError) throw caseError;

    if (caseData.assigned_doctor_id !== user.id) {
      throw new Error('You are not assigned to this case');
    }

    if (caseData.status !== 'assigned_doctor') {
      throw new Error('Case is not in the correct status for doctor review');
    }

    // Insert doctor verification
    const { error: verificationError } = await supabase
      .from('doctor_verifications')
      .insert({
        report_id: caseId,
        doctor_id: user.id,
        action: 'finalized',
        verified_summary: verifiedSummary,
        feedback: feedback || null,
        prescription: prescription || null,
        final_conclusion: verifiedSummary,
        verified_at: new Date().toISOString()
      });

    if (verificationError) throw verificationError;

    // Update case status to finalized
    const { error: updateError } = await supabase
      .from('ai_reports')
      .update({
        status: 'finalized',
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
        action: 'doctor_finalized',
        details: {
          timestamp: new Date().toISOString(),
          has_prescription: !!prescription
        }
      });

    if (auditError) console.error('Audit log error:', auditError);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Case finalized successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error finalizing doctor review:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});