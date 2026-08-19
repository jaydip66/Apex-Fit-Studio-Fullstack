import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Interactive Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // UPI Payment Gateway Modal State
  const [paymentPlan, setPaymentPlan] = useState(null);

  // AI Smart Fitness Coach States
  const [aiGoal, setAiGoal] = useState('muscle');
  const [aiDays, setAiDays] = useState('4');
  const [aiResult, setAiResult] = useState(null);

  // BMI Calculator State
  const [bmiInput, setBmiInput] = useState({ height: '', weight: '' });
  const [bmiResult, setBmiResult] = useState(null);

  // Timetable Filter State
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Live Gym Open Status
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Admin & API States
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Forms State
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', gender: 'Male', plan: '' });
  const [bookingData, setBookingData] = useState({ member_name: '', phone: '', facility_type: 'Personal Training', booking_date: '', time_slot: 'Morning (6:00 AM - 8:00 AM)' });
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', phone: '', message: '' });

  const API_URL = 'https://apex-fit-backend.onrender.com/api/';

  const images = {
    hero: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80',
    weights: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    crossfit: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
    yoga: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    trainer1: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80',
    trainer2: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    trainer3: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80',
    transform1: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=500&q=80',
    transform2: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=apexfit@upi&pn=ApexFitStudio&cu=INR'
  };

  useEffect(() => {
    fetchPlans();
    fetchBookings();
    if (token) fetchMembers();

    // Check if Gym is Open (6 AM - 10 PM IST)
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 22) {
      setIsOpenNow(true);
    } else {
      setIsOpenNow(false);
    }
  }, [token]);

  const fetchMembers = async () => { try { const res = await axios.get(`${API_URL}members/`); setMembers(res.data); } catch(e){} };
  const fetchPlans = async () => { try { const res = await axios.get(`${API_URL}plans/`); setPlans(res.data); } catch(e){} };
  const fetchBookings = async () => { try { const res = await axios.get(`${API_URL}bookings/`); setBookings(res.data); } catch(e){} };

  // AI Smart Fitness Coach Logic
  const runAiCoach = (e) => {
    e.preventDefault();
    let recPlan = 'Yearly VIP Apex Plan';
    let recDiet = 'High Protein Muscle Building Diet Plan';
    let recRoutine = 'Heavy Compound Lifting + Hypertrophy Split';

    if (aiGoal === 'fatloss') {
      recPlan = '6-Month Transformation Package';
      recDiet = 'Caloric Deficit High Fiber Protein Diet';
      recRoutine = '3 Days CrossFit HIIT + 2 Days Resistance Cardio';
    } else if (aiGoal === 'fitness') {
      recPlan = 'Monthly Standard Access';
      recDiet = 'Balanced Macro Maintenance Diet';
      recRoutine = 'Full Body Circuit + Yoga Flexibility';
    }

    setAiResult({ recPlan, recDiet, recRoutine });
  };

  // BMI Calculation
  const calculateBMI = (e) => {
    e.preventDefault();
    const hM = parseFloat(bmiInput.height) / 100;
    const wKg = parseFloat(bmiInput.weight);
    if (hM > 0 && wKg > 0) {
      const val = (wKg / (hM * hM)).toFixed(1);
      let cat = '';
      let color = '';
      if (val < 18.5) { cat = 'Underweight (Hypertrophy Gaining Recommended)'; color = 'text-info'; }
      else if (val < 25) { cat = 'Optimal / Fit (Maintenance Mode)'; color = 'text-success'; }
      else if (val < 30) { cat = 'Overweight (Fat Loss & HIIT Needed)'; color = 'text-warning'; }
      else { cat = 'Obese (Cardio & Controlled Calorie Diet)'; color = 'text-danger'; }
      setBmiResult({ val, cat, color });
    }
  };

  // Modal Triggers
  const openFacilityModal = (title, desc, img, equipment) => {
    setModalData({ title, desc, img, equipment });
    setActiveModal('facility');
  };

  const openTrainerModal = (name, role, exp, bio, img) => {
    setModalData({ name, role, exp, bio, img });
    setActiveModal('trainer');
  };

  const openPlanModal = (plan) => {
    setModalData(plan);
    setActiveModal('plan');
  };

  const showPopup = (title, message) => {
    setModalData({ title, message });
    setActiveModal('general');
  };

  const closeModal = () => { setActiveModal(null); setModalData(null); };

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', loginData);
      localStorage.setItem('token', res.data.access);
      setToken(res.data.access);
      showPopup('Login Successful!', 'Welcome Admin! Control panel unlocked.');
    } catch (err) {
      showPopup('Login Error', 'Invalid Credentials.');
    }
  };

  const handleLogout = () => { localStorage.removeItem('token'); setToken(''); setActiveTab('home'); };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}members/`, formData);
      showPopup('Registration Successful! 🎉', `Welcome ${formData.full_name}! Your membership is registered at Apex Fit Studio.`);
      setFormData({ full_name: '', email: '', phone: '', gender: 'Male', plan: '' });
      fetchMembers();
    } catch (err) { showPopup('Error', 'Registration Failed.'); }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}bookings/`, bookingData);
      showPopup('Slot Confirmed! 📅', `Session slot reserved for ${bookingData.member_name} on ${bookingData.booking_date}.`);
      setBookingData({ member_name: '', phone: '', facility_type: 'Personal Training', booking_date: '', time_slot: 'Morning (6:00 AM - 8:00 AM)' });
      fetchBookings();
    } catch (err) { showPopup('Error', 'Booking Failed.'); }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    showPopup('Inquiry Sent! 💬', `Thank you ${inquiryData.name}! Apex Fit Studio team will contact you shortly.`);
    setInquiryData({ name: '', email: '', phone: '', message: '' });
  };

  const generatePDF = (member) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 12, 32); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 193, 7); doc.setFontSize(20); doc.text("APEX FIT STUDIO", 20, 25);
    doc.setTextColor(0, 0, 0); doc.setFontSize(14); doc.text("OFFICIAL MEMBERSHIP PAYMENT RECEIPT", 20, 55); doc.line(20, 60, 190, 60);
    doc.setFontSize(11); doc.text(`Receipt ID: #APEX-${member.id}411`, 20, 75); doc.text(`Date: ${member.joining_date}`, 130, 75);
    doc.text(`Branch: Karvenagar, Pune - 411052`, 20, 85);
    doc.setFontSize(13); doc.text(`Member Name: ${member.full_name}`, 20, 105); doc.text(`Email: ${member.email}`, 20, 117); doc.text(`Contact: ${member.phone}`, 20, 129); doc.text(`Subscribed Plan: ${member.plan_name || 'Standard Plan'}`, 20, 141);
    doc.setFillColor(240, 240, 240); doc.rect(20, 160, 170, 25, 'F'); doc.setTextColor(40, 167, 69); doc.text("Payment Status: PAID & VERIFIED", 30, 176);
    doc.setTextColor(120, 120, 120); doc.setFontSize(10); doc.text("Royal Plaza, Near Rajaram Bridge, Karvenagar, Pune - 411052", 30, 220);
    doc.save(`Receipt_ApexFit_${member.full_name.replace(/\s+/g, '_')}.pdf`);
  };

  const schedule = {
    Monday: [ { time: '06:00 AM - 08:00 AM', class: 'CrossFit Power Batch', trainer: 'Ananya Roy' }, { time: '08:00 AM - 10:00 AM', class: 'Yoga & Flexibility', trainer: 'Rohan Verma' }, { time: '06:00 PM - 08:00 PM', class: 'Heavy Bodybuilding', trainer: 'Vikram Rathore' } ],
    Tuesday: [ { time: '06:00 AM - 08:00 AM', class: 'Fat Loss HIIT Session', trainer: 'Ananya Roy' }, { time: '08:00 AM - 10:00 AM', class: 'Cardio & Stamina', trainer: 'Rohan Verma' }, { time: '06:00 PM - 08:00 PM', class: 'Powerlifting Form', trainer: 'Vikram Rathore' } ],
    Wednesday: [ { time: '06:00 AM - 08:00 AM', class: 'Core & Endurance', trainer: 'Ananya Roy' }, { time: '08:00 AM - 10:00 AM', class: 'Yoga Recovery', trainer: 'Rohan Verma' }, { time: '06:00 PM - 08:00 PM', class: 'Chest & Arms Blast', trainer: 'Vikram Rathore' } ],
    Thursday: [ { time: '06:00 AM - 08:00 AM', class: 'CrossFit Mobility', trainer: 'Ananya Roy' }, { time: '08:00 AM - 10:00 AM', class: 'Morning Cardio', trainer: 'Rohan Verma' }, { time: '06:00 PM - 08:00 PM', class: 'Legs & Squats Heavy', trainer: 'Vikram Rathore' } ],
    Friday: [ { time: '06:00 AM - 08:00 AM', class: 'Full Body Circuit', trainer: 'Ananya Roy' }, { time: '08:00 AM - 10:00 AM', class: 'Stretching & Agility', trainer: 'Rohan Verma' }, { time: '06:00 PM - 08:00 PM', class: 'Back & Deadlift Special', trainer: 'Vikram Rathore' } ],
    Saturday: [ { time: '07:00 AM - 09:00 AM', class: 'Weekend Warrior HIIT', trainer: 'Ananya Roy' }, { time: '05:00 PM - 07:00 PM', class: 'Strength Showcase', trainer: 'Vikram Rathore' } ]
  };

  return (
    <div className="bg-dark text-white min-vh-100 font-sans d-flex flex-column live-animated-wrapper">
      
      {/* CSS STYLES */}
      <style>{`
        @keyframes liveMeshAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .live-animated-wrapper {
          background: linear-gradient(-45deg, #05050f, #120924, #081829, #1c0a18, #070714);
          background-size: 400% 400%;
          animation: liveMeshAnimation 16s ease infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 193, 7, 0.3) !important;
          transition: all 0.35s ease;
          cursor: pointer;
        }
        .glass-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: #ffc107 !important;
          box-shadow: 0 12px 30px rgba(255, 193, 7, 0.35);
        }
        .text-crisp-lead { color: #f8f9fa !important; font-weight: 500; }
        .text-sub-gold { color: #ffc107 !important; font-weight: 600; }
        .glow-btn { box-shadow: 0 0 15px rgba(255, 193, 7, 0.4); transition: all 0.3s ease; }
        .glow-btn:hover { box-shadow: 0 0 25px rgba(255, 193, 7, 0.85); transform: translateY(-2px); }
        .floating-cta { position: fixed; bottom: 25px; right: 25px; z-index: 999; }
        .nav-btn-custom {
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
      `}</style>

      {/* ===== TOP DISCOUNT BANNER ===== */}
      <div className="bg-warning text-dark text-center py-2 fw-bold small">
        ⚡ SPECIAL OFFER: Get 25% OFF on Yearly Subscriptions + Free Personal Diet Chart!
        <button className="btn btn-dark btn-sm ms-3 fw-bold py-0" onClick={() => setActiveTab('plans')}>Claim Offer Now ➔</button>
      </div>

      {/* ===== FLOATING ACTION BUTTONS ===== */}
      <div className="floating-cta d-flex flex-column gap-2">
        <a href="https://wa.me/919822041105?text=Hi%20Apex%20Fit%20Studio,%20I%20want%20to%20inquire%20about%20gym%20membership." target="_blank" rel="noreferrer" className="btn btn-success btn-lg rounded-circle shadow-lg p-3" title="WhatsApp Us">
          💬
        </a>
        <button className="btn btn-warning btn-lg rounded-circle shadow-lg glow-btn p-3" title="Quick Booking" onClick={() => setActiveTab('booking')}>
          ⚡
        </button>
      </div>

      {/* ===== UPI PAYMENT MODAL ===== */}
      {paymentPlan && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-warning shadow-lg rounded-4 p-4 text-center">
              <h4 className="fw-bold text-warning mb-2">Scan & Pay via GPay / PhonePe / Paytm</h4>
              <p className="text-crisp-lead small mb-3">Plan: {paymentPlan.name} (Amount: <span className="text-warning fw-bold">₹{paymentPlan.price}</span>)</p>
              
              <div className="bg-white p-3 rounded-3 d-inline-block mx-auto mb-3">
                <img src={images.qrCode} alt="UPI QR Code" style={{ width: '180px', height: '180px' }} />
              </div>
              
              <p className="fw-bold text-light mb-1">UPI ID: <span className="text-warning">apexfit@upi</span></p>
              <p className="text-muted small mb-4">Scan QR code using any UPI App to complete your membership payment.</p>
              
              <div className="d-flex justify-content-between gap-2">
                <button className="btn btn-outline-light w-50" onClick={() => setPaymentPlan(null)}>← Cancel</button>
                <button className="btn btn-warning w-50 fw-bold glow-btn" onClick={() => { setPaymentPlan(null); setActiveTab('plans'); showPopup('Payment Received! 🎉', 'Your payment is being verified by Apex Fit Studio Admin.'); }}>I Have Paid ➔</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== POPUP MODALS WITH EXPLICIT BACK BUTTONS ===== */}
      {activeModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border border-warning shadow-lg rounded-4 overflow-hidden position-relative">
              
              <button 
                type="button" 
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3" 
                onClick={closeModal}
                style={{ backgroundColor: '#ffc107', borderRadius: '50%', padding: '10px' }}
              ></button>

              {/* Facility Modal */}
              {activeModal === 'facility' && (
                <div>
                  <img src={modalData.img} className="w-100" alt="Facility" style={{ height: '260px', objectFit: 'cover' }} />
                  <div className="p-4">
                    <h3 className="fw-bold text-warning mb-2">{modalData.title}</h3>
                    <p className="text-light fs-6">{modalData.desc}</p>
                    <h6 className="fw-bold text-warning mt-3">Machinery & Gear Included:</h6>
                    <p className="text-crisp-lead small">{modalData.equipment}</p>
                    <div className="d-flex justify-content-between align-items-center mt-4 border-top border-secondary pt-3">
                      <button className="btn btn-outline-light px-4" onClick={closeModal}>← Back / Close</button>
                      <button className="btn btn-warning fw-bold px-4 glow-btn" onClick={() => { closeModal(); setActiveTab('booking'); }}>Book Trial Slot</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Trainer Modal */}
              {activeModal === 'trainer' && (
                <div className="p-4">
                  <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                      <img src={modalData.img} className="rounded-circle border border-warning border-3 mb-3" alt="Trainer" style={{ width: '160px', height: '160px', objectFit: 'cover' }} />
                      <h5 className="fw-bold mb-0">{modalData.name}</h5>
                      <span className="badge bg-warning text-dark">{modalData.role}</span>
                    </div>
                    <div className="col-md-8">
                      <h4 className="text-warning fw-bold">Trainer Experience: {modalData.exp}</h4>
                      <p className="text-light fs-6 mt-3">{modalData.bio}</p>
                      <div className="d-flex justify-content-between align-items-center mt-4 border-top border-secondary pt-3">
                        <button className="btn btn-outline-light px-4" onClick={closeModal}>← Back / Close</button>
                        <button className="btn btn-warning fw-bold px-4 glow-btn" onClick={() => { closeModal(); setActiveTab('booking'); }}>Book Personal Session</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Membership Plan Modal */}
              {activeModal === 'plan' && (
                <div className="p-4 text-center">
                  <h2 className="fw-bold text-warning mb-2">{modalData.name}</h2>
                  <h1 className="display-4 fw-extrabold text-white my-3">₹{modalData.price}</h1>
                  <p className="lead text-crisp-lead">{modalData.duration_months} Months Unlimited Gym Access</p>
                  <div className="bg-secondary bg-opacity-25 p-3 rounded-3 my-3 text-start">
                    <p className="mb-2 text-light">✓ Full Access to Cardio, Gym Floor, & Heavy Lifting</p>
                    <p className="mb-2 text-light">✓ Free Customized Diet & Nutrition Chart</p>
                    <p className="mb-2 text-light">✓ Locker & Steam Shower Facilities Included</p>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-4 pt-2">
                    <button className="btn btn-outline-light px-4" onClick={closeModal}>← Back / Cancel</button>
                    <button className="btn btn-warning btn-lg fw-bold px-4 glow-btn" onClick={() => { closeModal(); setPaymentPlan(modalData); }}>Pay via UPI / GPay 💳</button>
                  </div>
                </div>
              )}

              {/* General Alert Modal */}
              {activeModal === 'general' && (
                <div className="p-4 text-center">
                  <h3 className="fw-bold text-warning mb-3">{modalData.title}</h3>
                  <p className="fs-5 text-light">{modalData.message}</p>
                  <button className="btn btn-warning px-4 fw-bold mt-3" onClick={closeModal}>OK / Close</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ===== CLEAN SINGLE-ROW PUBLIC NAVBAR ===== */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-lg py-2 border-bottom border-warning border-opacity-25">
        <div className="container-fluid px-lg-5">
          
          {/* BRAND LOGO */}
          <button className="navbar-brand border-0 bg-transparent fw-bold fs-3 text-warning d-flex align-items-center gap-2 m-0" onClick={() => setActiveTab('home')}>
            ⚡ APEX FIT
          </button>
          
          {/* NAV BUTTONS - CLEAN SINGLE-ROW FLEX LAYOUT */}
          <div className="d-flex align-items-center gap-1 flex-nowrap overflow-auto ms-auto py-1">
            <button className={`nav-btn-custom btn ${activeTab === 'home' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('home')}>Home</button>
            <button className={`nav-btn-custom btn ${activeTab === 'services' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('services')}>Facilities</button>
            <button className={`nav-btn-custom btn ${activeTab === 'trainers' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('trainers')}>Trainers</button>
            <button className={`nav-btn-custom btn ${activeTab === 'ai' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('ai')}>🤖 AI Coach</button>
            <button className={`nav-btn-custom btn ${activeTab === 'timetable' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('timetable')}>Timetable</button>
            <button className={`nav-btn-custom btn ${activeTab === 'bmi' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('bmi')}>BMI Calculator</button>
            <button className={`nav-btn-custom btn ${activeTab === 'plans' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('plans')}>Plans</button>
            <button className={`nav-btn-custom btn ${activeTab === 'location' ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setActiveTab('location')}>📍 Location</button>
            <button className={`nav-btn-custom btn ${activeTab === 'booking' ? 'btn-warning glow-btn' : 'btn-warning'}`} onClick={() => setActiveTab('booking')}>Book Slot</button>
          </div>

        </div>
      </nav>

      {/* ===== 1. HOME PAGE ===== */}
      {activeTab === 'home' && (
        <div>
          <div className="text-white text-center py-5 d-flex align-items-center justify-content-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('${images.hero}')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '80vh' }}>
            <div className="container py-5">
              
              {/* LIVE OPEN/CLOSED BADGE INSIDE HERO SECTION */}
              <div className="d-inline-flex align-items-center gap-2 bg-black bg-opacity-75 border border-warning px-3 py-1 rounded-pill mb-3">
                <span className={`badge ${isOpenNow ? 'bg-success' : 'bg-danger'}`}>
                  {isOpenNow ? '● GYM OPEN NOW' : '● CLOSED NOW (Opens 6 AM)'}
                </span>
                <span className="text-light small fw-semibold">Karvenagar, Pune - 411052</span>
              </div>

              <h1 className="display-2 fw-extrabold text-uppercase text-white mb-3">APEX FIT STUDIO</h1>
              <p className="lead fs-4 text-crisp-lead max-w-2xl mx-auto mb-4">Near Rajaram Bridge, Karvenagar, Pune. Commercial high-end equipment, certified coaches & dynamic workout batches.</p>
              
              <div className="d-inline-flex align-items-center gap-2 bg-black bg-opacity-75 border border-warning px-3 py-2 rounded-pill mb-4">
                <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                <span className="text-warning fw-bold small">LIVE TRAFFIC: 38% Occupancy (Moderate - Best time to train)</span>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-warning btn-lg fw-bold px-4 glow-btn" onClick={() => setActiveTab('plans')}>Join Gym Now ➔</button>
                <button className="btn btn-outline-light btn-lg px-4" onClick={() => setActiveTab('ai')}>Consult AI Fitness Coach</button>
              </div>
            </div>
          </div>

          {/* MEMBER TRANSFORMATIONS */}
          <div className="container py-5">
            <h2 className="text-center fw-bold text-warning mb-2 text-uppercase">MEMBER TRANSFORMATIONS</h2>
            <p className="text-center text-crisp-lead mb-5">See how members achieved their dream physique at Apex Fit Studio</p>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card glass-card text-white p-3">
                  <div className="row align-items-center">
                    <div className="col-5">
                      <img src={images.transform1} className="w-100 rounded-3" alt="Transform" style={{ height: '180px', objectFit: 'cover' }} />
                    </div>
                    <div className="col-7">
                      <h5 className="fw-bold text-warning">Amit Kulkarni</h5>
                      <span className="badge bg-success mb-2">Lost 18 kg in 5 Months</span>
                      <p className="text-crisp-lead small mb-0">"Best gym in Karvenagar near Rajaram Bridge! Equipment is brand new and trainers are highly supportive."</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card glass-card text-white p-3">
                  <div className="row align-items-center">
                    <div className="col-5">
                      <img src={images.transform2} className="rounded-3 w-100" alt="Transform" style={{ height: '180px', objectFit: 'cover' }} />
                    </div>
                    <div className="col-7">
                      <h5 className="fw-bold text-warning">Sneha Patil</h5>
                      <span className="badge bg-success mb-2">Gained Strength & Tone</span>
                      <p className="text-crisp-lead small mb-0">"The CrossFit and Yoga batches are amazing! Safe environment and very convenient location."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 2. AI SMART FITNESS COACH ===== */}
      {activeTab === 'ai' && (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card glass-card p-4">
                <h2 className="text-center fw-bold text-warning mb-2">🤖 AI SMART FITNESS COACH</h2>
                <p className="text-center text-crisp-lead mb-4">AI Assistant for Apex Fit Studio Members</p>

                <form onSubmit={runAiCoach}>
                  <div className="mb-3">
                    <label className="form-label text-light">Select Primary Fitness Goal</label>
                    <select className="form-select bg-dark text-white border-secondary" value={aiGoal} onChange={(e) => setAiGoal(e.target.value)}>
                      <option value="muscle">Build Muscle & Heavy Strength</option>
                      <option value="fatloss">Rapid Fat Loss & Body Toning</option>
                      <option value="fitness">General Health, Yoga & Endurance</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light">Days Available Per Week</label>
                    <select className="form-select bg-dark text-white border-secondary" value={aiDays} onChange={(e) => setAiDays(e.target.value)}>
                      <option value="3">3 Days / Week</option>
                      <option value="4">4-5 Days / Week</option>
                      <option value="6">6 Days / Week (Dedicated)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-warning w-100 fw-bold py-2 glow-btn">Generate AI Recommendation</button>
                </form>

                {aiResult && (
                  <div className="mt-4 p-4 bg-dark border border-warning rounded-3">
                    <h4 className="text-warning fw-bold mb-3">🎯 AI Personal Recommendation:</h4>
                    <p className="mb-2 text-light"><strong>Recommended Plan:</strong> <span className="text-warning">{aiResult.recPlan}</span></p>
                    <p className="mb-2 text-light"><strong>Suggested Diet:</strong> {aiResult.recDiet}</p>
                    <p className="mb-3 text-light"><strong>Workout Split:</strong> {aiResult.recRoutine}</p>
                    <button className="btn btn-warning w-100 fw-bold glow-btn" onClick={() => setActiveTab('plans')}>Book Recommended Plan Now ➔</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 3. MAP LOCATION ===== */}
      {activeTab === 'location' && (
        <div className="container py-5">
          <h2 className="text-center fw-bold text-warning mb-2 text-uppercase">📍 LOCATION & ADDRESS</h2>
          <p className="text-center text-crisp-lead mb-4">Royal Plaza, Near Rajaram Bridge, Karvenagar, Pune - 411052</p>

          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="card glass-card p-4">
                <h4 className="text-warning fw-bold mb-3">Apex Fit Studio</h4>
                <p className="text-light mb-2"><strong>Address:</strong> Shop No. 101-105, 1st Floor, Royal Plaza, Near Rajaram Bridge, Karvenagar, Pune, Maharashtra - 411052.</p>
                <p className="text-light mb-2"><strong>Landmark:</strong> Opposite Cummins College Road Corner.</p>
                <p className="text-light mb-2"><strong>Phone:</strong> +91 98220 41105 / +91 98220 41106</p>
                <p className="text-light mb-2"><strong>Email:</strong> contact@apexfitstudio.com</p>
                <p className="text-light mb-0"><strong>Gym Hours:</strong> Monday - Saturday (6:00 AM - 10:00 PM IST)</p>
                
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-warning fw-bold mt-4 glow-btn">Open in Google Maps App ➔</a>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card glass-card p-2 rounded-4 overflow-hidden">
                <iframe 
                  title="Karvenagar Gym Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.568285920387!2d73.8182!3d18.4984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfec5e3328e1%3A0x633d99d8b135541c!2sKarve%20Nagar%2C%20Pune%2C%20Maharashtra%20411052!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="340" 
                  style={{ border: 0, borderRadius: '12px' }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 4. FACILITIES PAGE ===== */}
      {activeTab === 'services' && (
        <div className="container py-5">
          <h2 className="text-center fw-bold text-warning mb-2 text-uppercase">CLICK ANY FACILITY TO VIEW FULL DETAILS</h2>
          <p className="text-center text-crisp-lead mb-5 fs-5">Click on any card below to open details</p>
          
          <div className="row g-4">
            <div className="col-md-3" onClick={() => openFacilityModal('Cardio & Stamina Zone', 'High-end treadmills, rowing machines, and ellipticals with real-time heart rate tracking.', images.cardio, 'Commercial Treadmills, Cross-Trainers, Concept2 Rowers')}>
              <div className="card glass-card text-white h-100 rounded-3 overflow-hidden p-2">
                <img src={images.cardio} className="card-img-top rounded-2" alt="Cardio" style={{ height: '190px', objectFit: 'cover' }} />
                <div className="card-body"><h5 className="fw-bold text-warning mb-1">Cardio Zone</h5><p className="text-sub-gold small mb-0">Click to view details ➔</p></div>
              </div>
            </div>

            <div className="col-md-3" onClick={() => openFacilityModal('Heavy Weightlifting Arena', 'Barbells, dumbbells up to 50kg, power racks, and deadlift platforms.', images.weights, 'Olympic Barbells, Bumper Plates, Squat Racks, Dumbbells')}>
              <div className="card glass-card text-white h-100 rounded-3 overflow-hidden p-2">
                <img src={images.weights} className="card-img-top rounded-2" alt="Weights" style={{ height: '190px', objectFit: 'cover' }} />
                <div className="card-body"><h5 className="fw-bold text-warning mb-1">Heavy Weightlifting</h5><p className="text-sub-gold small mb-0">Click to view details ➔</p></div>
              </div>
            </div>

            <div className="col-md-3" onClick={() => openFacilityModal('CrossFit & HIIT Arena', 'Battle ropes, kettlebells, and plyo jump boxes engineered for calorie burn.', images.crossfit, 'Battle Ropes, Kettlebells, Plyo Boxes, Slam Balls')}>
              <div className="card glass-card text-white h-100 rounded-3 overflow-hidden p-2">
                <img src={images.crossfit} className="card-img-top rounded-2" alt="CrossFit" style={{ height: '190px', objectFit: 'cover' }} />
                <div className="card-body"><h5 className="fw-bold text-warning mb-1">CrossFit Studio</h5><p className="text-sub-gold small mb-0">Click to view details ➔</p></div>
              </div>
            </div>

            <div className="col-md-3" onClick={() => openFacilityModal('Yoga & Recovery Studio', 'Peaceful studio space for flexibility, core stability, and muscle recovery.', images.yoga, 'Yoga Mats, Foam Rollers, Resistance Bands')}>
              <div className="card glass-card text-white h-100 rounded-3 overflow-hidden p-2">
                <img src={images.yoga} className="card-img-top rounded-2" alt="Yoga" style={{ height: '190px', objectFit: 'cover' }} />
                <div className="card-body"><h5 className="fw-bold text-warning mb-1">Yoga & Recovery</h5><p className="text-sub-gold small mb-0">Click to view details ➔</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 5. TRAINERS PAGE ===== */}
      {activeTab === 'trainers' && (
        <div className="container py-5">
          <h2 className="text-center fw-bold text-warning mb-2 text-uppercase">MEET OUR CERTIFIED COACHES</h2>
          <p className="text-center text-crisp-lead mb-5 fs-5">Click on any trainer profile to view full bio</p>

          <div className="row g-4">
            <div className="col-md-4" onClick={() => openTrainerModal('Vikram Rathore', 'Head Bodybuilding Coach', '10+ Years', 'Specialized in Hypertrophy, Competition Prep, and Heavy Compound Lifting.', images.trainer1)}>
              <div className="card glass-card text-white text-center p-4">
                <img src={images.trainer1} className="rounded-circle mx-auto mb-3 border border-warning border-3" alt="Trainer" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                <h5 className="fw-bold mb-1 text-white">Vikram Rathore</h5>
                <p className="text-warning fw-bold small mb-2">Head Bodybuilding Coach</p>
                <span className="badge bg-warning text-dark font-semibold">Click to view Profile</span>
              </div>
            </div>

            <div className="col-md-4" onClick={() => openTrainerModal('Ananya Roy', 'CrossFit Lead', '7+ Years', 'Expert in Fat Loss, High-Intensity Interval Training (HIIT), and Agility.', images.trainer2)}>
              <div className="card glass-card text-white text-center p-4">
                <img src={images.trainer2} className="rounded-circle mx-auto mb-3 border border-warning border-3" alt="Trainer" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                <h5 className="fw-bold mb-1 text-white">Ananya Roy</h5>
                <p className="text-warning fw-bold small mb-2">CrossFit Lead</p>
                <span className="badge bg-warning text-dark font-semibold">Click to view Profile</span>
              </div>
            </div>

            <div className="col-md-4" onClick={() => openTrainerModal('Rohan Verma', 'Strength Specialist', '8+ Years', 'Certified Powerlifter and Dietician. Expert in Squat/Bench/Deadlift Form.', images.trainer3)}>
              <div className="card glass-card text-white text-center p-4">
                <img src={images.trainer3} className="rounded-circle mx-auto mb-3 border border-warning border-3" alt="Trainer" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                <h5 className="fw-bold mb-1 text-white">Rohan Verma</h5>
                <p className="text-warning fw-bold small mb-2">Strength Specialist</p>
                <span className="badge bg-warning text-dark font-semibold">Click to view Profile</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 6. TIMETABLE ===== */}
      {activeTab === 'timetable' && (
        <div className="container py-5">
          <h2 className="text-center fw-bold text-warning mb-2 text-uppercase">📅 WEEKLY CLASS TIMETABLE</h2>
          <p className="text-center text-crisp-lead mb-4 fs-5">Select a day to check scheduled sessions</p>

          <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
            {Object.keys(schedule).map((day) => (
              <button key={day} className={`btn ${selectedDay === day ? 'btn-warning fw-bold' : 'btn-outline-light'}`} onClick={() => setSelectedDay(day)}>
                {day}
              </button>
            ))}
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card glass-card p-4">
                <h4 className="text-warning fw-bold mb-3 text-center">{selectedDay} Schedule</h4>
                <div className="list-group">
                  {schedule[selectedDay].map((item, idx) => (
                    <div key={idx} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center py-3">
                      <div><h6 className="fw-bold mb-0 text-warning">{item.class}</h6><small className="text-crisp-lead">Coach: {item.trainer}</small></div>
                      <span className="badge bg-warning text-dark fs-6">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 7. BMI CALCULATOR ===== */}
      {activeTab === 'bmi' && (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card glass-card p-4">
                <h3 className="text-center fw-bold text-warning mb-3">⚖️ LIVE BMI CALCULATOR</h3>
                <form onSubmit={calculateBMI}>
                  <div className="mb-3"><label className="form-label text-light">Height (in cm)</label><input type="number" className="form-control bg-dark text-white border-secondary" required placeholder="e.g. 175" value={bmiInput.height} onChange={(e) => setBmiInput({...bmiInput, height: e.target.value})} /></div>
                  <div className="mb-3"><label className="form-label text-light">Weight (in kg)</label><input type="number" className="form-control bg-dark text-white border-secondary" required placeholder="e.g. 70" value={bmiInput.weight} onChange={(e) => setBmiInput({...bmiInput, weight: e.target.value})} /></div>
                  <button type="submit" className="btn btn-warning w-100 fw-bold py-2 glow-btn">Calculate BMI Score</button>
                </form>

                {bmiResult && (
                  <div className="mt-4 p-3 bg-dark border border-warning rounded-3 text-center">
                    <h5 className="mb-1 text-light">Your BMI Score: <span className="fw-bold text-warning">{bmiResult.val}</span></h5>
                    <p className={`fs-5 fw-bold mb-0 ${bmiResult.color}`}>Status: {bmiResult.cat}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 8. MEMBERSHIP PLANS ===== */}
      {activeTab === 'plans' && (
        <div className="container py-5">
          <h2 className="text-center fw-bold text-warning mb-2 text-uppercase">MEMBERSHIP PACKAGES</h2>
          <p className="text-center text-crisp-lead mb-5 fs-5">Click on any plan to view perks or pay via UPI</p>

          <div className="row g-4 mb-5">
            {plans.map((p) => (
              <div key={p.id} className="col-md-4" onClick={() => openPlanModal(p)}>
                <div className="card glass-card text-white text-center p-4 h-100">
                  <h4 className="fw-bold text-warning">{p.name}</h4>
                  <h2 className="display-5 fw-bold my-3">₹{p.price}</h2>
                  <p className="text-crisp-lead fw-semibold">{p.duration_months} Months Unlimited Access</p>
                  <button className="btn btn-outline-warning btn-sm mt-2">Pay via UPI / Details ➔</button>
                </div>
              </div>
            ))}
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card glass-card p-4">
                <h4 className="text-warning fw-bold text-center mb-3">Online Member Registration</h4>
                <form onSubmit={handleMemberSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label text-light">Full Name</label><input type="text" className="form-control bg-dark text-white border-secondary" required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="Rahul Sharma" /></div>
                    <div className="col-md-6"><label className="form-label text-light">Email</label><input type="email" className="form-control bg-dark text-white border-secondary" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="rahul@gmail.com" /></div>
                    <div className="col-md-6"><label className="form-label text-light">Phone</label><input type="text" className="form-control bg-dark text-white border-secondary" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" /></div>
                    <div className="col-md-6"><label className="form-label text-light">Gender</label><select className="form-select bg-dark text-white border-secondary" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}><option value="Male">Male</option><option value="Female">Female</option></select></div>
                    <div className="col-md-12"><label className="form-label text-light">Select Plan</label><select className="form-select bg-dark text-white border-secondary" required value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})}><option value="">-- Select Plan --</option>{plans.map((p) => (<option key={p.id} value={p.id}>{p.name} ({p.duration_months} Months - ₹{p.price})</option>))}</select></div>
                  </div>
                  <button type="submit" className="btn btn-warning w-100 fw-bold mt-4 py-2 glow-btn">Submit Registration</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 9. ONLINE SLOT BOOKING ===== */}
      {activeTab === 'booking' && (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="card glass-card p-4">
                <h3 className="text-center fw-bold text-warning mb-3">📅 BOOK SESSION / TRIAL SLOT</h3>
                <form onSubmit={handleBookingSubmit}>
                  <div className="mb-3"><label className="form-label text-light">Full Name</label><input type="text" className="form-control bg-dark text-white border-secondary" required value={bookingData.member_name} onChange={(e) => setBookingData({...bookingData, member_name: e.target.value})} /></div>
                  <div className="mb-3"><label className="form-label text-light">Phone Number</label><input type="text" className="form-control bg-dark text-white border-secondary" required value={bookingData.phone} onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} /></div>
                  <div className="mb-3"><label className="form-label text-light">Select Facility / Class</label><select className="form-select bg-dark text-white border-secondary" value={bookingData.facility_type} onChange={(e) => setBookingData({...bookingData, facility_type: e.target.value})}><option value="Personal Training">Personal Training</option><option value="Cardio Zone">Cardio Zone</option><option value="CrossFit Batch">CrossFit Batch</option><option value="Yoga Class">Yoga Class</option></select></div>
                  <div className="mb-3"><label className="form-label text-light">Date</label><input type="date" className="form-control bg-dark text-white border-secondary" required value={bookingData.booking_date} onChange={(e) => setBookingData({...bookingData, booking_date: e.target.value})} /></div>
                  <div className="mb-3"><label className="form-label text-light">Time Slot</label><select className="form-select bg-dark text-white border-secondary" value={bookingData.time_slot} onChange={(e) => setBookingData({...bookingData, time_slot: e.target.value})}><option value="Morning (6:00 AM - 8:00 AM)">Morning (6:00 AM - 8:00 AM)</option><option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option></select></div>
                  <button type="submit" className="btn btn-warning w-100 fw-bold py-2 glow-btn">Confirm Booking</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 10. HIDDEN STAFF PORTAL ===== */}
      {activeTab === 'admin' && (
        <div className="container py-5">
          {!token ? (
            <div className="d-flex justify-content-center">
              <div className="card glass-card p-4" style={{ width: '380px' }}>
                <h3 className="text-center fw-bold text-warning mb-3">🔒 Staff Login Portal</h3>
                <form onSubmit={handleLogin}>
                  <div className="mb-3"><label className="form-label text-light">Username</label><input type="text" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setLoginData({...loginData, username: e.target.value})} /></div>
                  <div className="mb-3"><label className="form-label text-light">Password</label><input type="password" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setLoginData({...loginData, password: e.target.value})} /></div>
                  <button type="submit" className="btn btn-warning w-100 fw-bold">Login to Portal</button>
                </form>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-warning">Apex Fit Studio Admin Portal</h3>
                <button className="btn btn-danger btn-sm fw-bold" onClick={handleLogout}>Logout Admin</button>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4"><div className="card bg-dark text-white p-3 border border-warning"><h6 className="text-warning">Total Members</h6><h2 className="fw-bold mb-0">{members.length}</h2></div></div>
                <div className="col-md-4"><div className="card bg-warning text-dark p-3"><h6 className="fw-bold">Active Bookings</h6><h2 className="fw-bold mb-0">{bookings.length}</h2></div></div>
                <div className="col-md-4"><div className="card bg-secondary text-white p-3"><h6 className="text-light">Plans Available</h6><h2 className="fw-bold mb-0">{plans.length}</h2></div></div>
              </div>

              <div className="card bg-dark text-white border border-secondary mb-4">
                <div className="card-header bg-black text-warning fw-bold">👥 Registered Members Directory</div>
                <div className="card-body p-0">
                  <table className="table table-dark table-hover mb-0">
                    <thead><tr><th>Name</th><th>Contact</th><th>Plan</th><th>Actions</th></tr></thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id}>
                          <td>{m.full_name}</td>
                          <td><small>{m.email}<br/>{m.phone}</small></td>
                          <td><span className="badge bg-warning text-dark">{m.plan_name || 'Standard'}</span></td>
                          <td><button onClick={() => generatePDF(m)} className="btn btn-sm btn-success fw-bold me-2">📄 PDF Receipt</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== GLOBAL FOOTER ===== */}
      <footer className="bg-black text-secondary py-4 mt-auto border-top border-secondary">
        <div className="container text-center">
          <p className="mb-1 text-light fw-bold">APEX FIT STUDIO (KARVENAGAR, PUNE - 411052)</p>
          <p className="small mb-2 text-crisp-lead">Royal Plaza, Near Rajaram Bridge, Karvenagar, Pune | Contact: +91 98220 41105</p>
          <button className="btn btn-link text-muted btn-sm text-decoration-none border-0 opacity-50 p-0" onClick={() => setActiveTab('admin')} style={{ fontSize: '11px' }}>
            🔒 Staff Portal Access
          </button>
        </div>
      </footer>

    </div>
  );
}

export default App;