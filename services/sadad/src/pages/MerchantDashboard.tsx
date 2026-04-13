import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Box,
  Table,
  Badge,
  SimpleGrid,
  ThemeIcon,
  Loader,
  Alert,
} from '@mantine/core';
import {
  IconCash,
  IconReceipt,
  IconTrendingUp,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import { formatOMR } from '@/utils/products';
import { MERCHANT, fetchMerchantTransactions } from '@/utils/payment';
import type { MerchantTransaction } from '@/utils/payment';

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof IconCash;
  color: string;
}) {
  return (
    <Paper shadow="sm" radius="md" p="lg" withBorder>
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
            {title}
          </Text>
          <Text size="xl" fw={700} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Text>
          <Text size="xs" c="dimmed">
            {subtitle}
          </Text>
        </Stack>
        <ThemeIcon size={48} radius="md" variant="light" color={color}>
          <Icon size={24} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

export default function MerchantDashboard() {
  const [cartOpen, setCartOpen] = useState(false);

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery<MerchantTransaction[]>({
    queryKey: ['merchant-transactions'],
    queryFn: fetchMerchantTransactions,
    staleTime: 30_000,
  });

  const totalRevenue = transactions
    ? transactions
        .filter((t) => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0)
    : 0;

  const paymentCount = transactions
    ? transactions.filter((t) => t.type === 'credit').length
    : 0;

  const avgPayment = paymentCount > 0 ? totalRevenue / paymentCount : 0;

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer opened={cartOpen} onClose={() => setCartOpen(false)} />

      <Container size="lg" py="xl">
        {/* Title */}
        <Group justify="space-between" align="flex-start" mb="xl">
          <Box>
            <Title order={2}>Merchant Dashboard</Title>
            <Text size="sm" c="dimmed">
              {MERCHANT.name} / {MERCHANT.nameAr}
            </Text>
          </Box>
          <Badge
            color="blue"
            variant="light"
            size="lg"
            style={{ fontFamily: 'monospace' }}
          >
            {MERCHANT.accountId}
          </Badge>
        </Group>

        {/* Stats */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
          <StatCard
            title="Total Revenue"
            value={formatOMR(totalRevenue)}
            subtitle="All received payments"
            icon={IconCash}
            color="teal"
          />
          <StatCard
            title="Payments Received"
            value={paymentCount.toString()}
            subtitle="Successful transactions"
            icon={IconReceipt}
            color="blue"
          />
          <StatCard
            title="Average Payment"
            value={formatOMR(avgPayment)}
            subtitle="Per transaction"
            icon={IconTrendingUp}
            color="violet"
          />
        </SimpleGrid>

        {/* Transactions table */}
        <Paper shadow="sm" radius="md" p="lg" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={600} size="lg">
              Recent Payments
            </Text>
            <Text size="sm" c="dimmed">
              Account: {MERCHANT.iban}
            </Text>
          </Group>

          {isLoading && (
            <Stack align="center" py="xl">
              <Loader size="md" color="blue" />
              <Text c="dimmed">Loading transactions...</Text>
            </Stack>
          )}

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              Failed to load transactions. Please try again.
            </Alert>
          )}

          {transactions && transactions.length > 0 && (
            <Box style={{ overflowX: 'auto' }}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {transactions.map((txn) => (
                    <Table.Tr key={txn.id}>
                      <Table.Td>
                        <Text size="sm">
                          {dayjs(txn.date).format('DD MMM YYYY')}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {dayjs(txn.date).format('HH:mm')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          size="sm"
                          fw={500}
                          c="blue.7"
                          style={{ fontFamily: 'monospace' }}
                        >
                          {txn.reference}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{txn.customer_name}</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Text
                          size="sm"
                          fw={600}
                          c="teal.7"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          +{formatOMR(txn.amount)}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Badge
                          color={txn.status === 'completed' ? 'teal' : 'yellow'}
                          variant="light"
                          size="sm"
                        >
                          {txn.status}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          )}

          {transactions && transactions.length === 0 && (
            <Stack align="center" py="xl">
              <Text size="3rem" style={{ opacity: 0.3 }}>
                {'\u{1F4B0}'}
              </Text>
              <Text c="dimmed">No transactions yet</Text>
            </Stack>
          )}
        </Paper>

        {/* Footer */}
        <Text size="xs" c="dimmed" ta="center" mt="xl">
          Sadad ({'\u0633\u062F\u0627\u062F'}) Merchant Portal — Powered by Bank Dhofar Open Banking
        </Text>
      </Container>
    </Box>
  );
}
