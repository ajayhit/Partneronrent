import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { loginUser, registerUser } from "../api";
import type { User } from "../types";

const CITIES = [
  "Delhi NCR","Mumbai","Bangalore","Hyderabad","Chennai",
  "Pune","Kolkata","Jaipur","Ahmedabad","Lucknow",
];
const REGISTER_AS_OPTIONS = [
  { value: "client",  label: "Hirer — I want to find a companion" },
  { value: "partner", label: "Partner — I want to offer companionship" },
  { value: "both",    label: "Both — I am hirer and a partner" },
];
const PERKS = [
  "Find verified, background-checked companions",
  "Secure payments with full money protection",
  "Built-in SOS & 24x7 safety monitoring",
  "Platonic companionship — 100% professional",
];

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const signInPasswordRef = useRef<TextInput>(null);
  const signUpEmailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const signUpPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [formY, setFormY] = useState(320);

  const scrollToField = (offsetFromForm: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, formY + offsetFromForm),
        animated: true,
      });
    }, 100);
  };

  const [signInEmail, setSignInEmail]       = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPwd, setShowSignInPwd]   = useState(false);

  const [name, setName]                     = useState("");
  const [signUpEmail, setSignUpEmail]       = useState("");
  const [phone, setPhone]                   = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPwd]    = useState("");
  const [showSignUpPwd, setShowSignUpPwd]   = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [city, setCity]                     = useState("Delhi NCR");
  const [cityOpen, setCityOpen]             = useState(false);
  const [registerAs, setRegisterAs]         = useState<"client" | "partner" | "both">("client");
  const [roleOpen, setRoleOpen]             = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const switchTab = (t: "signin" | "signup") => {
    setTab(t);
    setError("");
    setSuccess("");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: Math.max(0, formY - 30), animated: true });
    }, 50);
  };

  const handleSignIn = async () => {
    setError(""); setSuccess("");
    if (!signInEmail.trim() || !signInPassword) {
      setError("Please enter your email or phone number and password."); return;
    }
    setIsLoading(true);
    try {
      let result: any = null;
      let lastError = "";

      // 1. Try auto-detect without role (matches web login behavior)
      try {
        result = await loginUser(signInEmail.trim(), signInPassword);
      } catch (err: any) {
        lastError = err.message;
      }

      // 2. If needed, fallback to testing specific roles
      if (!result?.success) {
        for (const role of ["client", "partner", "both", "admin"]) {
          try {
            result = await loginUser(signInEmail.trim(), signInPassword, role);
            if (result?.success) break;
          } catch (err: any) {
            lastError = err.message;
          }
        }
      }

      if (result?.success && result.user) {
        setSuccess("Welcome back! Loading your dashboard...");
        setTimeout(() => onLoginSuccess(result.user), 600);
      } else {
        setError(lastError || "Invalid email or password. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "Cannot connect to server. Check your Wi-Fi connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError(""); setSuccess("");
    if (!name.trim() || !signUpEmail.trim() || !signUpPassword) {
      setError("Please fill in all required fields."); return;
    }
    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (signUpPassword !== confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setIsLoading(true);
    try {
      const res = await registerUser({
        name: name.trim(), email: signUpEmail.trim(),
        phone: phone.trim() || "+91 00000 00000",
        password: signUpPassword, role: registerAs, city,
      });
      if (res?.success && res.user) {
        setSuccess("Account created! Welcome, " + res.user.name + "!");
        setTimeout(() => onLoginSuccess(res.user), 700);
      } else {
        setError(res?.message || "Could not create account. Email may already be in use.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >

        {/* Brand Panel */}
        <View style={s.brandPanel}>
          <View style={s.logoWrap}>
            <View style={s.logoMark}><Text style={s.logoHeart}>🤝</Text></View>
            <View>
              <Text style={s.logoName}>Partner<Text style={s.logoPink}>OnRent</Text></Text>
              <Text style={s.logoSub}>EMOTIONAL WELLNESS PLATFORM</Text>
            </View>
          </View>
          <Text style={s.subLabel}>{tab === "signin" ? "WELCOME BACK" : "JOIN US TODAY"}</Text>
          <Text style={s.headline}>{tab === "signin" ? "Sign in to your account" : "Create your free account"}</Text>
          <Text style={s.tagline}>
            {tab === "signin"
              ? "Access your personalized portal and continue where you left off."
              : "Join thousands of users on India's most trusted companion platform."}
          </Text>
          <View style={s.perksWrap}>
            {PERKS.map((p, i) => (
              <View key={i} style={s.perkRow}>
                <Text style={s.perkDot}>✦</Text>
                <Text style={s.perkText}>{p}</Text>
              </View>
            ))}
          </View>
          <View style={s.badgesRow}>
            {[{e:"🛡️",l:"Verified & Safe"},{e:"⭐",l:"4.9 Rated"},{e:"✨",l:"50K+ Users"}].map((b,i)=>(
              <View key={i} style={s.badge}>
                <Text style={s.badgeEmoji}>{b.e}</Text>
                <Text style={s.badgeLabel}>{b.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Form Panel */}
        <View
          style={s.formPanel}
          onLayout={(e) => {
            const y = e.nativeEvent.layout.y;
            if (y > 0) setFormY(y);
          }}
        >

          {/* Tabs */}
          <View style={s.tabs}>
            {(["signin","signup"] as const).map(t => (
              <Pressable key={t} style={[s.tab, tab===t && s.tabActive]} onPress={() => switchTab(t)}>
                <Text style={[s.tabText, tab===t && s.tabTextActive]}>
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Alerts */}
          {!!error && (
            <View style={s.alertError}>
              <Text style={s.alertIcon}>⚠ </Text>
              <Text style={s.alertErrorText}>{error}</Text>
            </View>
          )}
          {!!success && (
            <View style={s.alertSuccess}>
              <Text style={s.alertIcon}>✔ </Text>
              <Text style={s.alertSuccessText}>{success}</Text>
            </View>
          )}

          {/* SIGN IN */}
          {tab === "signin" && (
            <View>
              <Text style={s.fLabel}>Email Address or Phone Number</Text>
              <TextInput
                style={s.input}
                placeholder="your@email.com or phone"
                placeholderTextColor="#475569"
                value={signInEmail}
                onChangeText={setSignInEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onFocus={() => scrollToField(-20)}
                onSubmitEditing={() => signInPasswordRef.current?.focus()}
              />

              <Text style={s.fLabel}>Password</Text>
              <View style={s.pwdRow}>
                <TextInput
                  ref={signInPasswordRef}
                  style={[s.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Enter your password"
                  placeholderTextColor="#475569"
                  value={signInPassword}
                  onChangeText={setSignInPassword}
                  secureTextEntry={!showSignInPwd}
                  returnKeyType="done"
                  onFocus={() => scrollToField(60)}
                  onSubmitEditing={handleSignIn}
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowSignInPwd(v => !v)}>
                  <Text style={s.eyeText}>{showSignInPwd ? "🙈" : "👁️"}</Text>
                </Pressable>
              </View>

              <Pressable style={[s.submitBtn, isLoading && s.btnOff]} onPress={handleSignIn} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitText}>→  Sign In</Text>}
              </Pressable>

              <Text style={s.hint}>
                {"Don't have an account?  "}
                <Text style={s.hintLink} onPress={() => switchTab("signup")}>Create one free</Text>
              </Text>
              <Text style={s.note}>🛡️ All sessions are 100% Platonic — Code of Conduct enforced.</Text>
            </View>
          )}

          {/* SIGN UP */}
          {tab === "signup" && (
            <View>
              {/* Register As */}
              <Text style={s.fLabel}>I want to register as *</Text>
              <Pressable style={s.picker} onPress={() => setRoleOpen(v => !v)}>
                <Text style={s.pickerTxt}>{REGISTER_AS_OPTIONS.find(o => o.value === registerAs)?.label}</Text>
                <Text style={s.pickerArrow}>{roleOpen ? "▲" : "▼"}</Text>
              </Pressable>
              {roleOpen && (
                <View style={s.dropdown}>
                  {REGISTER_AS_OPTIONS.map(opt => (
                    <Pressable key={opt.value}
                      style={[s.ddItem, registerAs === opt.value && s.ddItemOn]}
                      onPress={() => { setRegisterAs(opt.value as any); setRoleOpen(false); }}>
                      <Text style={[s.ddText, registerAs === opt.value && s.ddTextOn]}>{opt.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {registerAs === "both" && (
                <View style={s.bothNote}>
                  <Text style={s.bothTxt}>You can switch between Hirer and Partner modes from your profile after signing up.</Text>
                </View>
              )}

              <Text style={s.fLabel}>Full Name *</Text>
              <TextInput
                style={s.input}
                placeholder="Your full name"
                placeholderTextColor="#475569"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                onFocus={() => scrollToField(40)}
                onSubmitEditing={() => signUpEmailRef.current?.focus()}
              />

              <Text style={s.fLabel}>Email Address *</Text>
              <TextInput
                ref={signUpEmailRef}
                style={s.input}
                placeholder="your@email.com"
                placeholderTextColor="#475569"
                value={signUpEmail}
                onChangeText={setSignUpEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onFocus={() => scrollToField(120)}
                onSubmitEditing={() => phoneRef.current?.focus()}
              />

              <Text style={s.fLabel}>Phone Number</Text>
              <TextInput
                ref={phoneRef}
                style={s.input}
                placeholder="+91 98765 43210"
                placeholderTextColor="#475569"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
                onFocus={() => scrollToField(190)}
                onSubmitEditing={() => signUpPasswordRef.current?.focus()}
              />

              <Text style={s.fLabel}>Password *</Text>
              <View style={s.pwdRow}>
                <TextInput
                  ref={signUpPasswordRef}
                  style={[s.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Min 6 characters"
                  placeholderTextColor="#475569"
                  value={signUpPassword}
                  onChangeText={setSignUpPassword}
                  secureTextEntry={!showSignUpPwd}
                  returnKeyType="next"
                  onFocus={() => scrollToField(270)}
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowSignUpPwd(v => !v)}>
                  <Text style={s.eyeText}>{showSignUpPwd ? "🙈" : "👁️"}</Text>
                </Pressable>
              </View>

              <Text style={s.fLabel}>Confirm Password *</Text>
              <View style={s.pwdRow}>
                <TextInput
                  ref={confirmPasswordRef}
                  style={[s.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Repeat password"
                  placeholderTextColor="#475569"
                  value={confirmPassword}
                  onChangeText={setConfirmPwd}
                  secureTextEntry={!showConfirmPwd}
                  returnKeyType="done"
                  onFocus={() => scrollToField(350)}
                  onSubmitEditing={handleSignUp}
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowConfirmPwd(v => !v)}>
                  <Text style={s.eyeText}>{showConfirmPwd ? "🙈" : "👁️"}</Text>
                </Pressable>
              </View>

              <Text style={s.fLabel}>City</Text>
              <Pressable style={s.picker} onPress={() => setCityOpen(v => !v)}>
                <Text style={s.pickerTxt}>{city}</Text>
                <Text style={s.pickerArrow}>{cityOpen ? "▲" : "▼"}</Text>
              </Pressable>
              {cityOpen && (
                <View style={s.dropdown}>
                  {CITIES.map(c => (
                    <Pressable key={c} style={[s.ddItem, city===c && s.ddItemOn]}
                      onPress={() => { setCity(c); setCityOpen(false); }}>
                      <Text style={[s.ddText, city===c && s.ddTextOn]}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <Pressable style={[s.submitBtn, isLoading && s.btnOff]} onPress={handleSignUp} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitText}>✨  Create Account</Text>}
              </Pressable>

              <Text style={s.hint}>
                {"Already have an account?  "}
                <Text style={s.hintLink} onPress={() => switchTab("signin")}>Sign in</Text>
              </Text>
              <Text style={s.note}>By creating an account you agree to our Terms of Service and Privacy Policy.</Text>
            </View>
          )}
        </View>

        <Text style={s.footer}>PartnerOnRent • Safe, Verified & Platonic Companionship</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const P = "#7c3aed";
const PINK = "#ec4899";
const V = "#a78bfa";

const s = StyleSheet.create({
  root:        { flex:1, backgroundColor:"#0f172a" },
  scroll:      { paddingBottom:280 },
  brandPanel:  { backgroundColor:"#0f172a", paddingHorizontal:24, paddingTop:56, paddingBottom:28, borderBottomWidth:1, borderBottomColor:"rgba(255,255,255,0.06)" },
  logoWrap:    { flexDirection:"row", alignItems:"center", gap:12, marginBottom:24 },
  logoMark:    { width:52, height:52, borderRadius:16, backgroundColor:P, alignItems:"center", justifyContent:"center", shadowColor:P, shadowOffset:{width:0,height:4}, shadowOpacity:0.55, shadowRadius:10, elevation:8 },
  logoHeart:   { fontSize:26 },
  logoName:    { fontSize:20, fontWeight:"900", color:"#f8fafc", letterSpacing:-0.5 },
  logoPink:    { color:PINK },
  logoSub:     { fontSize:9, fontWeight:"700", letterSpacing:1.6, color:"#475569" },
  subLabel:    { fontSize:10, fontWeight:"800", letterSpacing:2, color:V, marginBottom:6 },
  headline:    { fontSize:22, fontWeight:"900", color:"#f8fafc", marginBottom:8, lineHeight:28 },
  tagline:     { fontSize:13, color:"#64748b", lineHeight:20, marginBottom:20 },
  perksWrap:   { gap:8, marginBottom:20 },
  perkRow:     { flexDirection:"row", alignItems:"flex-start", gap:8 },
  perkDot:     { color:V, fontSize:11, marginTop:1 },
  perkText:    { fontSize:12, color:"#94a3b8", flex:1, lineHeight:18 },
  badgesRow:   { flexDirection:"row", flexWrap:"wrap", gap:8 },
  badge:       { flexDirection:"row", alignItems:"center", gap:4, paddingHorizontal:10, paddingVertical:5, backgroundColor:"rgba(255,255,255,0.05)", borderWidth:1, borderColor:"rgba(255,255,255,0.08)", borderRadius:999 },
  badgeEmoji:  { fontSize:11 },
  badgeLabel:  { fontSize:11, color:"#64748b", fontWeight:"600" },
  formPanel:   { backgroundColor:"#111827", marginHorizontal:16, marginTop:20, borderRadius:20, padding:20, borderWidth:1, borderColor:"rgba(255,255,255,0.07)" },
  tabs:        { flexDirection:"row", backgroundColor:"rgba(15,23,42,0.6)", borderWidth:1, borderColor:"rgba(255,255,255,0.07)", borderRadius:10, padding:4, marginBottom:16 },
  tab:         { flex:1, paddingVertical:10, alignItems:"center", borderRadius:7 },
  tabActive:   { backgroundColor:"rgba(124,58,237,0.3)", borderWidth:1, borderColor:"rgba(124,58,237,0.3)" },
  tabText:     { fontSize:13, fontWeight:"700", color:"#475569" },
  tabTextActive:{ color:"#e2d9f3" },
  alertError:  { flexDirection:"row", alignItems:"flex-start", gap:6, backgroundColor:"rgba(239,68,68,0.1)", borderWidth:1, borderColor:"rgba(239,68,68,0.3)", borderRadius:10, padding:12, marginBottom:14 },
  alertSuccess:{ flexDirection:"row", alignItems:"flex-start", gap:6, backgroundColor:"rgba(16,185,129,0.1)", borderWidth:1, borderColor:"rgba(16,185,129,0.3)", borderRadius:10, padding:12, marginBottom:14 },
  alertIcon:   { fontSize:14, fontWeight:"800", color:"#94a3b8" },
  alertErrorText:  { color:"#f87171", fontSize:12, fontWeight:"600", flex:1, lineHeight:18 },
  alertSuccessText:{ color:"#34d399", fontSize:12, fontWeight:"600", flex:1, lineHeight:18 },
  fLabel:      { fontSize:11, fontWeight:"700", color:"#64748b", marginBottom:6, marginTop:12 },
  input:       { backgroundColor:"rgba(15,23,42,0.7)", borderWidth:1, borderColor:"rgba(255,255,255,0.08)", borderRadius:10, paddingHorizontal:14, paddingVertical:11, fontSize:13, color:"#f8fafc", marginBottom:2 },
  pwdRow:      { flexDirection:"row", alignItems:"center", marginBottom:2 },
  eyeBtn:      { position:"absolute", right:12, top:0, bottom:0, justifyContent:"center", paddingHorizontal:4 },
  eyeText:     { fontSize:16 },
  picker:      { flexDirection:"row", alignItems:"center", justifyContent:"space-between", backgroundColor:"rgba(15,23,42,0.7)", borderWidth:1, borderColor:"rgba(255,255,255,0.08)", borderRadius:10, paddingHorizontal:14, paddingVertical:11, marginBottom:2 },
  pickerTxt:   { fontSize:13, color:"#f8fafc", flex:1 },
  pickerArrow: { fontSize:11, color:"#64748b" },
  dropdown:    { backgroundColor:"#1e293b", borderWidth:1, borderColor:"rgba(255,255,255,0.08)", borderRadius:10, marginBottom:4, overflow:"hidden" },
  ddItem:      { paddingHorizontal:14, paddingVertical:12, borderBottomWidth:1, borderBottomColor:"rgba(255,255,255,0.05)" },
  ddItemOn:    { backgroundColor:"rgba(124,58,237,0.2)" },
  ddText:      { fontSize:13, color:"#94a3b8" },
  ddTextOn:    { color:V, fontWeight:"700" },
  bothNote:    { backgroundColor:"rgba(124,58,237,0.08)", borderWidth:1, borderColor:"rgba(124,58,237,0.2)", borderRadius:8, padding:10, marginVertical:4 },
  bothTxt:     { fontSize:11, color:"#64748b", lineHeight:16 },
  submitBtn:   { marginTop:18, paddingVertical:14, borderRadius:12, alignItems:"center", backgroundColor:P, shadowColor:P, shadowOffset:{width:0,height:4}, shadowOpacity:0.45, shadowRadius:12, elevation:6 },
  btnOff:      { opacity:0.6 },
  submitText:  { color:"#fff", fontSize:15, fontWeight:"800", letterSpacing:0.3 },
  hint:        { textAlign:"center", fontSize:12, color:"#475569", marginTop:14 },
  hintLink:    { color:V, fontWeight:"700" },
  note:        { textAlign:"center", fontSize:10, color:"#334155", marginTop:12, lineHeight:15 },
  footer:      { textAlign:"center", fontSize:10, color:"#334155", marginTop:28, paddingHorizontal:20 },
});
