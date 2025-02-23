// src/components/atoms/Button.tsx
import React from 'react';
import styled from 'styled-components/native';
import Text from './Text';

interface ButtonProps {
  primary?: boolean;
  disabled?: boolean;
}

const StyledButton = styled.TouchableOpacity<ButtonProps>`
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${({primary, theme}) =>
    primary ? theme.primary : theme.surface};
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const Button: React.FC<
  ButtonProps & {onPress: () => void; title: string;}
> = ({title, onPress, primary, disabled}) => {
  return (
    <StyledButton disabled={disabled} onPress={onPress} primary={primary}>
      <Text bold color={primary ? 'white' : undefined}>
        {title}
      </Text>
    </StyledButton>
  );
};

export default Button;
