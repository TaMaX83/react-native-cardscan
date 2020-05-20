import React, { useState, useCallback, useEffect } from 'react';
import { Text, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Cardscan from 'react-native-cardscan';
import { CardView } from 'react-native-credit-card-input';

const StyledText = ({ color, bold, ...otherProps }) => (
  <Text
    {...otherProps}
    style={{
      fontSize: 18,
      margin: 10,
      textAlign: 'center',
      color: color || '#263547',
      fontWeight: bold ? '700' : '500',
    }}
  />
);

export default () => {
  const [compatible, setCompatible] = useState(null);
  const [card, setCard] = useState(null);
  const [recentAction, setRecentAction] = useState('none');

  const scanCard = useCallback(async () => {
    const { action, payload } = await Cardscan.scan();
    setRecentAction(action);
    if (action === 'scanned') {
      setCard({
        number: payload.number,
        expiryMonth: payload.expiryMonth || '??',
        expiryYear: payload.expiryYear || '??',
        issuer: payload.issuer || '??',
      });
    }
  }, [setCard, setRecentAction]);

  const checkCompatible = useCallback(async () => {
    const isCompatible = await Cardscan.isSupportedAsync();
    setCompatible(isCompatible);
  }, [setCompatible]);

  useEffect(() => {
    checkCompatible();
  }, []);

  return (
    <SafeAreaView>
      <StyledText>
        Supported:{' '}
        {compatible == null ? 'Loading...' :
          compatible ?
            <StyledText color="#00B971">Yes</StyledText> :
            <StyledText color="#ff5345">No</StyledText>
        }
      </StyledText>
      {compatible &&
        <StyledText>Recent action: {recentAction}</StyledText>
      }
      {compatible &&
        <TouchableOpacity onPress={scanCard}>
          <StyledText bold>Scan card</StyledText>
        </TouchableOpacity>
      }
      {card &&
        <View style={{ margin: 20, flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <CardView
            number={card.number}
            expiry={`${card.expiryMonth.padStart(2, '0')}/${card.expiryYear.slice(-2)}`}
          />
        </View>
      }
    </SafeAreaView>
  );
};
