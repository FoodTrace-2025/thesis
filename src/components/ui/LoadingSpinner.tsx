import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingSpinner({
  text = 'Loading...',
  size = 'lg',
}: LoadingSpinnerProps) {
  return (
    <Center py={10}>
      <VStack spacing={4}>
        <Spinner
          size={size}
          thickness="4px"
          color="brand.primary"
          speed="0.6s"
        />
        {text && (
          <Text fontSize="sm" color="gray.600">
            {text}
          </Text>
        )}
      </VStack>
    </Center>
  );
}
