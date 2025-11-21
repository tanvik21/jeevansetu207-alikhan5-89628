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

    const { caseId, role } = await req.json();

    if (!caseId || !role) {
      throw new Error('Missing caseId or role');
    }

    let result;
    if (role === 'intern') {
      const { data, error } = await supabase.rpc('atomic_claim_case_intern', {
        p_case_id: caseId,
        p_intern_id: user.id
      });

      if (error) throw error;
      result = data;
    } else if (role === 'doctor') {
      const { data, error } = await supabase.rpc('atomic_claim_case_doctor', {
        p_case_id: caseId,
        p_doctor_id: user.id
      });

      if (error) throw error;
      result = data;
    } else {
      throw new Error('Invalid role');
    }

    if (!result.success) {
      return new Response(
        JSON.stringify(result),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error claiming case:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});