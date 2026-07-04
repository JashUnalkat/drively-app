import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * InsuranceScreen Component
 * Handles the multi-step insurance quote and payment process.
 * Features: Form validation, dynamic age calculation, and multi-modal flow.
 */
export default function InsuranceScreen() {
  // --- FORM STATES ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // --- DROPDOWN STATES ---
  // Using multiple states to handle the 'z-index' requirements of react-native-dropdown-picker
  const [dayOpen, setDayOpen] = useState(false);
  const [day, setDay] = useState('1');
  const [monthOpen, setMonthOpen] = useState(false);
  const [month, setMonth] = useState('1');
  const [yearOpen, setYearOpen] = useState(false);
  const [year, setYear] = useState('2000');
  
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState('Male');
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [licenseType, setLicenseType] = useState('G');
  const [yearsOpen, setYearsOpen] = useState(false);
  const [yearsDriving, setYearsDriving] = useState('0');
  
  const [makeOpen, setMakeOpen] = useState(false);
  const [carMake, setCarMake] = useState('Mazda');
  const [modelOpen, setModelOpen] = useState(false);
  const [carModel, setCarModel] = useState('CX-5');
  const [yearCarOpen, setYearCarOpen] = useState(false);
  const [carYear, setCarYear] = useState('2020');
  
  const [scoreModeOpen, setScoreModeOpen] = useState(false);
  const [scoreMode, setScoreMode] = useState('account');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualScore, setManualScore] = useState('80');

  // --- LOGIC & FLOW STATES ---
  const [age, setAge] = useState(0);
  const [quoteResults, setQuoteResults] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Modal Visibility Sequence: Results -> Payment -> Confirm -> Success
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  // --- PAYMENT STATES ---
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // --- UTILITY FUNCTIONS ---

  // Formats Postal Code to Canadian Standard: A1A 1A1
  const formatPostalCode = (text) => {
    let cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length > 6) cleaned = cleaned.substring(0, 6);
    if (cleaned.length > 3) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
    }
    return cleaned;
  };

  // Formats Credit Card: 1234 5678 1234 5678
  const formatCardNumber = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 16) cleaned = cleaned.substring(0, 16);
    let matched = cleaned.match(/.{1,4}/g);
    return matched ? matched.join(' ') : cleaned;
  };

  // Formats Expiry Date: MM/YY
  const formatExpiry = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 4) cleaned = cleaned.substring(0, 4);
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    return cleaned;
  };

  // --- MEMOIZED DATA ARRAYS ---
  const dayItems = useMemo(() => [...Array(31)].map((_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })), []);
  const monthItems = useMemo(() => [...Array(12)].map((_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })), []);
  const yearItems = useMemo(() => [...Array(61)].map((_, i) => ({ label: `${1965 + i}`, value: `${1965 + i}` })), []);
  const genderItems = [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }];
  const licenseItems = [{ label: 'G1', value: 'G1' }, { label: 'G2', value: 'G2' }, { label: 'Full G', value: 'G' }];
  const yearsItems = useMemo(() => [...Array(51)].map((_, i) => ({ label: `${i}`, value: `${i}` })), []);
  const makeItems = [{ label: 'Mazda', value: 'Mazda' }, { label: 'Honda', value: 'Honda' }, { label: 'Vinfast', value: 'Vinfast' }];
  const modelItems = [{ label: 'CX-5', value: 'CX-5' }, { label: 'Civic', value: 'Civic' }, { label: 'VF8', value: 'VF8' }];
  const yearCarItems = useMemo(() => [...Array(27)].map((_, i) => ({ label: `${2000 + i}`, value: `${2000 + i}` })), []);
  const scoreModeItems = [{ label: 'Account Score (82)', value: 'account' }, { label: 'Manual Input', value: 'manual' }];
  const manualItems = useMemo(() => [...Array(101)].map((_, i) => ({ label: `${i}`, value: `${i}` })), []);

  // Recalculate age whenever DOB changes
  useEffect(() => {
    const today = new Date();
    const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) calculatedAge--;
    setAge(calculatedAge);
  }, [day, month, year]);

  // Ensures only one dropdown is open at a time to prevent UI overlaps
  const closeOthers = (currentSetter) => {
    const setters = [setDayOpen, setMonthOpen, setYearOpen, setGenderOpen, setLicenseOpen, setYearsOpen, setMakeOpen, setModelOpen, setYearCarOpen, setScoreModeOpen, setManualOpen];
    setters.forEach(s => { if (s !== currentSetter) s(false); });
  };

  const handleGetQuote = () => {
    let baseMonthlyQuote = 240;
    const providers = [
      { id: 1, name: 'Aviva', adjustment: -10 },
      { id: 2, name: 'TD Insurance', adjustment: 5 },
      { id: 3, name: 'Intact Insurance', adjustment: 12 },
    ];
    const results = providers.map((p) => ({
      ...p,
      monthly: Math.max(120, baseMonthlyQuote + p.adjustment),
      yearly: (Math.max(120, baseMonthlyQuote + p.adjustment)) * 12
    }));
    setQuoteResults(results);
    setModalVisible(true);
  };

  const pickerProps = { listMode: "SCROLLVIEW", dropDownDirection: "BOTTOM", style: styles.dropdown, dropDownContainerStyle: styles.dropdownList };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0057b7', '#4f8cff']} style={styles.header}>
        <Text style={styles.headerTitle}>Insurance Quote</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} nestedScrollEnabled={true}>
        <Text style={styles.label}>Personal Details</Text>
        <TextInput placeholder="First Name" style={styles.input} value={firstName} onChangeText={setFirstName} />
        <TextInput placeholder="Last Name" style={styles.input} value={lastName} onChangeText={setLastName} />

        <Text style={styles.label}>Date of Birth (Age: {age})</Text>
        <View style={[styles.row, { zIndex: 10000 }]}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <DropDownPicker {...pickerProps} open={dayOpen} value={day} items={dayItems} setOpen={(o) => { setDayOpen(o); if(o) closeOthers(setDayOpen); }} setValue={setDay} />
          </View>
          <View style={{ flex: 1, marginRight: 5 }}>
            <DropDownPicker {...pickerProps} open={monthOpen} value={month} items={monthItems} setOpen={(o) => { setMonthOpen(o); if(o) closeOthers(setMonthOpen); }} setValue={setMonth} />
          </View>
          <View style={{ flex: 1 }}>
            <DropDownPicker {...pickerProps} open={yearOpen} value={year} items={yearItems} setOpen={(o) => { setYearOpen(o); if(o) closeOthers(setYearOpen); }} setValue={setYear} />
          </View>
        </View>

        <View style={[styles.fieldContainer, { zIndex: 9000 }]}><Text style={styles.label}>Gender</Text><DropDownPicker {...pickerProps} open={genderOpen} value={gender} items={genderItems} setOpen={(o) => { setGenderOpen(o); if(o) closeOthers(setGenderOpen); }} setValue={setGender} /></View>
        <View style={[styles.fieldContainer, { zIndex: 8000 }]}><Text style={styles.label}>License Type</Text><DropDownPicker {...pickerProps} open={licenseOpen} value={licenseType} items={licenseItems} setOpen={(o) => { setLicenseOpen(o); if(o) closeOthers(setLicenseOpen); }} setValue={setLicenseType} /></View>
        <View style={[styles.fieldContainer, { zIndex: 7000 }]}><Text style={styles.label}>Years Driving</Text><DropDownPicker {...pickerProps} open={yearsOpen} value={yearsDriving} items={yearsItems} setOpen={(o) => { setYearsOpen(o); if(o) closeOthers(setYearsOpen); }} setValue={setYearsDriving} /></View>
        <View style={[styles.fieldContainer, { zIndex: 6000 }]}><Text style={styles.label}>Car Make</Text><DropDownPicker {...pickerProps} open={makeOpen} value={carMake} items={makeItems} setOpen={(o) => { setMakeOpen(o); if(o) closeOthers(setMakeOpen); }} setValue={setCarMake} /></View>
        <View style={[styles.fieldContainer, { zIndex: 5000 }]}><Text style={styles.label}>Car Model</Text><DropDownPicker {...pickerProps} open={modelOpen} value={carModel} items={modelItems} setOpen={(o) => { setModelOpen(o); if(o) closeOthers(setModelOpen); }} setValue={setCarModel} /></View>
        
        <Text style={styles.label}>Postal Code (A1A 1A1)</Text>
        <TextInput 
          placeholder="M5V 2L7" 
          style={styles.input} 
          value={postalCode} 
          onChangeText={(txt) => setPostalCode(formatPostalCode(txt))}
          autoCapitalize="characters"
          maxLength={7}
        />

        <View style={[styles.fieldContainer, { zIndex: 4000 }]}><Text style={styles.label}>Driving Score Mode</Text><DropDownPicker {...pickerProps} open={scoreModeOpen} value={scoreMode} items={scoreModeItems} setOpen={(o) => { setScoreModeOpen(o); if(o) closeOthers(setScoreModeOpen); }} setValue={setScoreMode} /></View>
        {scoreMode === 'manual' && (
          <View style={[styles.fieldContainer, { zIndex: 3000 }]}><Text style={styles.label}>Select Score</Text><DropDownPicker {...pickerProps} open={manualOpen} value={manualScore} items={manualItems} setOpen={(o) => { setManualOpen(o); if(o) closeOthers(setManualOpen); }} setValue={setManualScore} /></View>
        )}

        <TouchableOpacity style={styles.btn} onPress={handleGetQuote}>
          <Text style={styles.btnText}>Get Quote Comparison</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- 1. RESULTS MODAL --- */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.resultsTitle}>Choose Provider</Text>
            <ScrollView>
              {quoteResults.map((provider) => (
                <TouchableOpacity 
                  key={provider.id} 
                  style={styles.resultCard} 
                  onPress={() => {
                    setSelectedProvider(provider);
                    setModalVisible(false);
                    setPaymentModalVisible(true);
                  }}
                >
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.monthlyPrice}>${provider.monthly} / month</Text>
                  <Text style={styles.selectText}>Tap to Select & Pay</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}><Text style={{ color: '#fff' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- 2. PAYMENT MODAL --- */}
      <Modal visible={paymentModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.resultsTitle}>Payment Method</Text>
            <Text style={styles.label}>Card Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="1234 5678 1234 5678" 
              keyboardType="numeric" 
              value={cardNumber} 
              onChangeText={(txt) => setCardNumber(formatCardNumber(txt))}
              maxLength={19} 
            />
            <View style={styles.row}>
              <View style={{ flex: 1.5, marginRight: 10 }}>
                <Text style={styles.label}>Expiry (MM/YY)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="MM/YY" 
                  keyboardType="numeric"
                  value={expiry} 
                  onChangeText={(txt) => setExpiry(formatExpiry(txt))}
                  maxLength={5} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>CVC</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="123" 
                  keyboardType="numeric" 
                  value={cvv} 
                  onChangeText={setCvv} 
                  maxLength={3} 
                />
              </View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => {setPaymentModalVisible(false); setConfirmModalVisible(true);}}><Text style={styles.btnText}>Continue to Review</Text></TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPaymentModalVisible(false)}><Text style={{ color: '#fff' }}>Back</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- 3. PRE-CONFIRM WINDOW --- */}
      <Modal visible={confirmModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.resultsTitle}>Review Information</Text>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}><Text style={styles.bold}>Provider:</Text> {selectedProvider?.name}</Text>
              <Text style={styles.confirmText}><Text style={styles.bold}>Name:</Text> {firstName} {lastName}</Text>
              <Text style={styles.confirmText}><Text style={styles.bold}>Vehicle:</Text> {carYear} {carMake} {carModel}</Text>
              <Text style={styles.confirmText}><Text style={styles.bold}>Postal:</Text> {postalCode}</Text>
              <Text style={styles.confirmText}><Text style={styles.bold}>Monthly Cost:</Text> ${selectedProvider?.monthly}</Text>
              <Text style={styles.confirmText}><Text style={styles.bold}>Payment Card:</Text> **** {cardNumber.slice(-4)}</Text>
            </View>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#2ecc71' }]} onPress={() => {setConfirmModalVisible(false); setSuccessVisible(true);}}><Text style={styles.btnText}>Confirm & Pay</Text></TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setConfirmModalVisible(false)}><Text style={{ color: '#fff' }}>Edit Details</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- 4. SUCCESS WINDOW --- */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center' }]}>
            <MaterialCommunityIcons name="check-circle" size={80} color="#2ecc71" />
            <Text style={[styles.resultsTitle, { marginTop: 20 }]}>Payment Successful!</Text>
            <Text style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>Your policy with {selectedProvider?.name} is now active.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => setSuccessVisible(false)}><Text style={styles.btnText}>Finish</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f0f2f5' 
  },
  header: { 
    padding: 30, 
    paddingTop: Platform.OS === 'ios' ? 20 : 50, 
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 }
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 26, 
    fontWeight: '900', 
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  scrollContent: { 
    padding: 20 
  },
  fieldContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 12, 
    fontWeight: '900', 
    color: '#64748b', 
    marginBottom: 8, 
    marginTop: 15,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  input: { 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 30, 
    borderWidth: 2, 
    borderColor: '#e2e8f0', 
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  dropdown: { 
    borderColor: '#e2e8f0', 
    borderRadius: 30, 
    borderWidth: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    height: 55
  },
  dropdownList: { 
    borderColor: '#e2e8f0', 
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btn: { 
    backgroundColor: '#0057b7', 
    padding: 22, 
    borderRadius: 32, 
    alignItems: 'center', 
    marginTop: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  btnText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.75)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    width: '92%', 
    maxHeight: '85%', 
    padding: 30, 
    borderRadius: 32,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  resultsTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#0057b7',
    textTransform: 'uppercase'
  },
  resultCard: { 
    backgroundColor: '#f8fafc', 
    borderRadius: 30, 
    padding: 20, 
    marginBottom: 15, 
    borderWidth: 2, 
    borderColor: '#e2e8f0',
    elevation: 2
  },
  providerName: { 
    fontWeight: '900', 
    fontSize: 20,
    color: '#1e293b'
  },
  monthlyPrice: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#2ecc71', 
    marginVertical: 5 
  },
  selectText: { 
    color: '#0057b7', 
    fontWeight: '900', 
    fontSize: 12,
    letterSpacing: 1
  },
  closeButton: { 
    marginTop: 15, 
    backgroundColor: '#94a3b8', 
    padding: 18, 
    borderRadius: 32, 
    alignItems: 'center' 
  },
  confirmBox: { 
    backgroundColor: '#f1f5f9', 
    padding: 20, 
    borderRadius: 24, 
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  confirmText: { 
    fontSize: 16, 
    marginBottom: 10, 
    color: '#334155',
    fontWeight: '600'
  },
  bold: { 
    fontWeight: '900',
    color: '#0f172a'
  }
});