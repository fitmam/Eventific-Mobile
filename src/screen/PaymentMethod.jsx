import React from 'react';
import {Appbar} from 'react-native-paper';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {RadioButton} from 'react-native-paper';
import styles from '../styles/global';
import {useFocusEffect} from '@react-navigation/native';
import http from '../helpers/http';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';

const PaymentMethod = ({route, navigation}) => {
  const {reservationId, totalPayment} = route.params;
  const token = useSelector(state => state.auth.token);
  const [payment, setPayment] = React.useState([]);
  const [paymentId, setPaymentId] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      async function getPayment() {
        const {data} = await http(token).get('/payment');
        setPayment(data.results);
      }
      getPayment();
    }, [token]),
  );

  async function makePayment() {
    try {
      const paymentMethodId = paymentId;
      const body = new URLSearchParams({
        reservationId,
        paymentMethodId,
      }).toString();
      const {data} = await http(token).post('/payment', body);
      if (data.success == true) {
        navigation.navigate('My Booking');
      }
    } catch (err) {
      console.warn(err.response?.data?.message);
    }
  }

  return (
    <View style={{backgroundColor: '#19a7ce'}}>
      <Appbar.Header style={styles.ScrollViewStyle}>
        <Appbar.BackAction onPress={() => {}} color="white" />
        <Appbar.Content titleStyle={styles.ManageHeaderStyle} title="Payment" />
      </Appbar.Header>
      <View style={styles.PaymentWrapper}>
        <View>
          <Text style={styles.TextPayment}>Payment Method</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '80%',
            justifyContent: 'space-between',
          }}>
          <View>
            {payment.map(p => {
              return (
                <View style={styles.PaymentMethodWrapper} key={p.id}>
                  <View style={styles.PaymentMethodChildWrapper}>
                    <RadioButton
                      value="0"
                      status={checked === p.id ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setPaymentId(p.id);
                        setChecked(p.id);
                      }}
                    />
                    <Image
                      source={{
                        uri: `https://res.cloudinary.com/dxnewldiy/image/upload/f_auto,q_auto/v1/payment/${p.picture}`,
                      }}
                      style={{width: 50, height: 50}}
                    />
                    <Text
                      style={styles.PaymentMethodText}
                      onPress={() => setPaymentId(p.id)}>
                      {p.name}
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={require('../assets/images/chevron-down.png')}
                    />
                  </View>
                </View>
              );
            })}
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 20,
                paddingTop: 30,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins-Medium',
                  color: 'black',
                }}>
                Total: Rp.{totalPayment}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 150,
                height: 40,
                backgroundColor: '#19a7ce',
                borderRadius: 5,
                margin: 20,
              }}
              onPress={makePayment}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  textAlign: 'center',
                  paddingTop: 8,
                  color: 'white',
                }}>
                Pay Tickets
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentMethod;
