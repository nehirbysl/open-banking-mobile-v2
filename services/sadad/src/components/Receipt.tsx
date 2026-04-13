import { Paper, Text, Group, Stack, Divider, Box, ThemeIcon } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { formatOMR } from '@/utils/products';
import { MERCHANT } from '@/utils/payment';
import dayjs from 'dayjs';

interface ReceiptProps {
  amount: number;
  reference: string;
  consentId: string;
  date?: string;
}

export default function Receipt({ amount, reference, consentId, date }: ReceiptProps) {
  const displayDate = date ? dayjs(date).format('DD MMM YYYY, HH:mm') : dayjs().format('DD MMM YYYY, HH:mm');

  return (
    <Paper
      shadow="md"
      radius="lg"
      p="xl"
      withBorder
      maw={480}
      mx="auto"
      style={{
        borderTop: '4px solid #00b894',
        background: 'white',
      }}
    >
      <Stack align="center" gap="md" mb="lg">
        <ThemeIcon size={64} radius="xl" color="teal" variant="light">
          <IconCircleCheck size={40} stroke={1.5} />
        </ThemeIcon>
        <Text size="xl" fw={700} c="teal.7">
          Payment Successful
        </Text>
        <Text size="sm" c="dimmed">
          {'\u062A\u0645\u062A \u0639\u0645\u0644\u064A\u0629 \u0627\u0644\u062F\u0641\u0639 \u0628\u0646\u062C\u0627\u062D'}
        </Text>
      </Stack>

      <Box
        py="lg"
        px="md"
        mb="md"
        style={{
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <Text size="xs" c="dimmed" tt="uppercase" fw={500} mb={4}>
          Amount Paid
        </Text>
        <Text
          size="2rem"
          fw={700}
          c="dark"
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
        >
          {formatOMR(amount)}
        </Text>
      </Box>

      <Stack gap="sm">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Merchant</Text>
          <Text size="sm" fw={500}>{MERCHANT.name}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">IBAN</Text>
          <Text size="sm" fw={500} style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {MERCHANT.iban}
          </Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Reference</Text>
          <Text size="sm" fw={600} c="blue.7" style={{ fontFamily: 'monospace' }}>
            {reference}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Consent ID</Text>
          <Text size="sm" style={{ fontFamily: 'monospace', fontSize: 11 }}>
            {consentId.length > 16 ? `${consentId.slice(0, 8)}...${consentId.slice(-8)}` : consentId}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Date</Text>
          <Text size="sm" fw={500}>{displayDate}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Status</Text>
          <Text size="sm" fw={600} c="teal.7">Completed</Text>
        </Group>
      </Stack>

      <Divider my="md" />
      <Text size="xs" c="dimmed" ta="center">
        Powered by Bank Dhofar Open Banking (PISP)
      </Text>
    </Paper>
  );
}
