import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface ContainerProps {
  children: ReactNode;
}

export function Container({ children }: ContainerProps) {
  return (
    <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} w="100%">
      {children}
    </Box>
  );
}
