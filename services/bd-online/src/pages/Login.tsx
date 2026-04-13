/**
 * Login page — redirects to Keycloak for authentication.
 * Shows Bank Dhofar branding while redirect happens.
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Center,
  Stack,
  Paper,
  Text,
  Button,
  Loader,
  Box,
  Divider,
} from '@mantine/core';
import { IconBuildingBank, IconLogin, IconShieldCheck } from '@tabler/icons-react';
import { login, isAuthenticated } from '@/utils/auth';

export default function Login() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // If coming from a consent flow, preserve the consent params
  const consentId = searchParams.get('consent_id');
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');
  const clientId = searchParams.get('client_id');

  useEffect(() => {
    // Check if already authenticated
    isAuthenticated().then((authed) => {
      if (authed) {
        // Already logged in — redirect to dashboard or consent page
        if (consentId) {
          const params = new URLSearchParams();
          params.set('consent_id', consentId);
          if (redirectUri) params.set('redirect_uri', redirectUri);
          if (state) params.set('state', state);
          if (clientId) params.set('client_id', clientId);
          window.location.href = `/consent/approve?${params.toString()}`;
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setLoading(false);
      }
    });
  }, [consentId, redirectUri, state, clientId]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Store consent params in sessionStorage so we can restore after callback
      if (consentId) {
        sessionStorage.setItem(
          'bd_online_consent_redirect',
          JSON.stringify({ consentId, redirectUri, state, clientId }),
        );
      }
      await login();
    } catch (err) {
      setError('Failed to redirect to login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4D9134 0%, #326323 50%, #264c1b 100%)',
      }}
    >
      <Center h="100vh">
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          w={420}
          style={{ maxWidth: '90vw' }}
        >
          <Stack align="center" gap="lg">
            {/* Bank logo and name */}
            <Box
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                backgroundColor: '#4D9134',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconBuildingBank size={36} color="white" />
            </Box>

            <Stack align="center" gap={4}>
              <Text size="xl" fw={700} c="dark">
                Bank Dhofar
              </Text>
              <Text size="md" c="dimmed">
                {'بنك ظفار'}
              </Text>
            </Stack>

            <Text size="sm" c="dimmed" ta="center">
              Internet Banking / {'الخدمات المصرفية عبر الإنترنت'}
            </Text>

            <Divider w="100%" />

            {consentId && (
              <Box
                style={{
                  backgroundColor: '#f0f9ed',
                  borderRadius: 8,
                  padding: '12px 16px',
                  width: '100%',
                }}
              >
                <Stack gap={4} align="center">
                  <IconShieldCheck size={20} color="#4D9134" />
                  <Text size="sm" ta="center" c="#4D9134" fw={500}>
                    A service provider is requesting access to your account information.
                  </Text>
                  <Text size="xs" ta="center" c="dimmed">
                    {'يطلب مزود خدمة الوصول إلى معلومات حسابك.'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Please sign in to review and approve.
                  </Text>
                </Stack>
              </Box>
            )}

            {error && (
              <Text size="sm" c="red" ta="center">
                {error}
              </Text>
            )}

            <Button
              fullWidth
              size="lg"
              color="green"
              radius="md"
              leftSection={loading ? <Loader size="sm" color="white" /> : <IconLogin size={20} />}
              onClick={handleLogin}
              disabled={loading}
              style={{ backgroundColor: '#4D9134' }}
            >
              {loading ? 'Redirecting...' : 'Sign In'}
            </Button>

            <Text size="xs" c="dimmed" ta="center">
              Secured by Bank Dhofar. Your credentials are handled by our identity provider.
            </Text>
          </Stack>
        </Paper>
      </Center>
    </Box>
  );
}
