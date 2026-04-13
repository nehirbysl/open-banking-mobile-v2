import {
  Drawer,
  Text,
  Group,
  Stack,
  Button,
  ActionIcon,
  Box,
  Divider,
  Badge,
} from '@mantine/core';
import { IconTrash, IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/App';
import { formatOMR } from '@/utils/products';

interface CartDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export default function CartDrawer({ opened, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items, itemCount, total, add, decrement, remove } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconShoppingCart size={22} />
          <Text fw={700} size="lg">
            Shopping Cart
          </Text>
          {itemCount > 0 && (
            <Badge color="blue" variant="filled" size="lg" circle>
              {itemCount}
            </Badge>
          )}
        </Group>
      }
      position="right"
      size="md"
      padding="lg"
    >
      {items.length === 0 ? (
        <Stack align="center" justify="center" h={300} gap="md">
          <Box style={{ fontSize: 64, opacity: 0.3 }}>
            <IconShoppingCart size={64} stroke={1} />
          </Box>
          <Text c="dimmed" size="lg">
            Your cart is empty
          </Text>
          <Text c="dimmed" size="sm">
            Browse our collection of authentic Omani goods
          </Text>
          <Button variant="light" color="blue" onClick={onClose}>
            Continue Shopping
          </Button>
        </Stack>
      ) : (
        <Stack justify="space-between" h="calc(100vh - 120px)">
          <Stack gap="sm" style={{ flex: 1, overflow: 'auto' }}>
            {items.map((item) => (
              <Box
                key={item.product.id}
                p="sm"
                style={{
                  border: '1px solid #e9ecef',
                  borderRadius: 8,
                  background: '#fafafa',
                }}
              >
                <Group justify="space-between" wrap="nowrap" align="flex-start">
                  <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <Box
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        flexShrink: 0,
                      }}
                    >
                      {item.product.emoji}
                    </Box>
                    <Stack gap={2} style={{ minWidth: 0 }}>
                      <Text size="sm" fw={600} truncate="end">
                        {item.product.name}
                      </Text>
                      <Text
                        size="sm"
                        fw={600}
                        c="blue.7"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatOMR(item.product.price * item.quantity)}
                      </Text>
                    </Stack>
                  </Group>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => remove(item.product.id)}
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>

                <Group justify="flex-end" mt="xs" gap="xs">
                  <ActionIcon
                    variant="light"
                    color="gray"
                    size="sm"
                    radius="md"
                    onClick={() => decrement(item.product.id)}
                    aria-label="Decrease quantity"
                  >
                    <IconMinus size={14} />
                  </ActionIcon>
                  <Text
                    size="sm"
                    fw={600}
                    w={28}
                    ta="center"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {item.quantity}
                  </Text>
                  <ActionIcon
                    variant="light"
                    color="blue"
                    size="sm"
                    radius="md"
                    onClick={() => add(item.product)}
                    aria-label="Increase quantity"
                  >
                    <IconPlus size={14} />
                  </ActionIcon>
                </Group>
              </Box>
            ))}
          </Stack>

          <Box>
            <Divider my="md" />
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={500}>
                Total
              </Text>
              <Text
                size="xl"
                fw={700}
                c="blue.7"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatOMR(total)}
              </Text>
            </Group>
            <Button
              fullWidth
              size="lg"
              color="blue"
              radius="md"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Stack>
      )}
    </Drawer>
  );
}
