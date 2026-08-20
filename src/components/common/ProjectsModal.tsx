import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ProjectsModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // State for form focus styling
  const [focusName, setFocusName] = useState(false);
  const [focusClient, setFocusClient] = useState(false);
  const [focusContact, setFocusContact] = useState(false);
  const [focusDetails, setFocusDetails] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      document.body.classList.add('overlay-open');
    };
    
    window.addEventListener('openProjectsModal', handleOpen);
    
    return () => {
      window.removeEventListener('openProjectsModal', handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.classList.remove('overlay-open');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(i18n.language === 'en' ? 'Project request submitted successfully! Team El8 will contact you shortly.' : 'تم إرسال طلب المشروع بنجاح! سيقوم فريق El8 بالتواصل معك قريباً.');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`projects-modal-backdrop active`} 
      id="projectsModal" 
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="projects-modal" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Ambient background glow inside glass modal */}
        <div 
          style={{
            position: 'absolute', top: '-100px', right: '-100px', width: '260px', height: '260px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0) 70%)',
            pointerEvents: 'none', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
          }} 
        />
        <div 
          style={{
            position: 'absolute', bottom: '-100px', left: '-100px', width: '260px', height: '260px',
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0) 70%)',
            pointerEvents: 'none', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
          }} 
        />

        <button 
          className="projects-modal-close" 
          id="closeProjectsModal" 
          aria-label={t('drawer_close_aria') || 'Close'}
          onClick={handleClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ display: 'inline-flex', width: 'fit-content', marginBottom: '12px', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(8px)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
            <span>{t('nav.projects')}</span>
          </div>
          <h2 
            style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, marginBottom: '8px' }} 
            dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' ? 'إضافة <span class="grad">مشروع جديد</span>' : 'Add <span class="grad">New Project</span>' }}
          />
          <p style={{ color: 'var(--text-2)', fontSize: '.92rem', lineHeight: 1.7 }}>
            {i18n.language === 'ar' ? 'أدخل تفاصيل مشروعك وسيقوم فريق El8 بدراسته والبدء بتطويره بأعلى معايير السرعة والجودة.' : 'Enter your project details and Team El8 will review it and start building with top speed and quality.'}
          </p>
        </div>

        <form id="addProjectModalForm" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
                {i18n.language === 'ar' ? 'اسم المشروع / الفكرة' : 'Project Name / Idea'}
              </label>
              <input 
                type="text" 
                required 
                placeholder={i18n.language === 'ar' ? 'مثال: تطبيق توصيل / نظام ERP' : 'e.g. Delivery App / ERP System'}
                style={{ 
                  width: '100%', padding: '11px 14px', borderRadius: '14px', 
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${focusName ? 'rgba(168, 85, 247, 0.8)' : 'rgba(255, 255, 255, 0.12)'}`, 
                  boxShadow: focusName ? '0 0 16px rgba(168, 85, 247, 0.3)' : 'none',
                  color: 'var(--text)', fontFamily: 'inherit', fontSize: '.88rem', outline: 'none', transition: 'all .3s ease' 
                }}
                onFocus={() => setFocusName(true)}
                onBlur={() => setFocusName(false)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
                {i18n.language === 'ar' ? 'نوع المشروع' : 'Project Category'}
              </label>
              <select 
                required 
                style={{ 
                  width: '100%', padding: '11px 14px', borderRadius: '14px', 
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '.88rem', outline: 'none', cursor: 'pointer' 
                }}
              >
                <option value="web" style={{ background: '#0e0a1a', color: '#fff' }}>{i18n.language === 'ar' ? 'تطبيقات الويب والمواقع' : 'Web Apps & Websites'}</option>
                <option value="mobile" style={{ background: '#0e0a1a', color: '#fff' }}>{i18n.language === 'ar' ? 'تطبيقات الهواتف الذكية (APK / iOS)' : 'Mobile Apps (APK / iOS)'}</option>
                <option value="ai" style={{ background: '#0e0a1a', color: '#fff' }}>{i18n.language === 'ar' ? 'الذكاء الاصطناعي والبيانات' : 'AI & Data Science'}</option>
                <option value="desktop" style={{ background: '#0e0a1a', color: '#fff' }}>{i18n.language === 'ar' ? 'برامج سطح المكتب (EXE)' : 'Desktop Software (EXE)'}</option>
                <option value="hardware" style={{ background: '#0e0a1a', color: '#fff' }}>{i18n.language === 'ar' ? 'الهاردوير والأوفلاين' : 'Hardware & Offline IoT'}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
                {i18n.language === 'ar' ? 'الاسم / اسم الشركة' : 'Name / Company'}
              </label>
              <input 
                type="text" 
                required 
                placeholder={i18n.language === 'ar' ? 'اسمك الكريم' : 'Your Name'}
                style={{ 
                  width: '100%', padding: '11px 14px', borderRadius: '14px', 
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${focusClient ? 'rgba(168, 85, 247, 0.8)' : 'rgba(255, 255, 255, 0.12)'}`, 
                  boxShadow: focusClient ? '0 0 16px rgba(168, 85, 247, 0.3)' : 'none',
                  color: 'var(--text)', fontFamily: 'inherit', fontSize: '.88rem', outline: 'none', transition: 'all .3s ease' 
                }}
                onFocus={() => setFocusClient(true)}
                onBlur={() => setFocusClient(false)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
                {i18n.language === 'ar' ? 'رقم الهاتف / التليجرام' : 'Phone / Telegram'}
              </label>
              <input 
                type="text" 
                required 
                placeholder={i18n.language === 'ar' ? '07xxxxxxxx أو @username' : '07xxxxxxxx or @username'}
                style={{ 
                  width: '100%', padding: '11px 14px', borderRadius: '14px', 
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${focusContact ? 'rgba(168, 85, 247, 0.8)' : 'rgba(255, 255, 255, 0.12)'}`, 
                  boxShadow: focusContact ? '0 0 16px rgba(168, 85, 247, 0.3)' : 'none',
                  color: 'var(--text)', fontFamily: 'inherit', fontSize: '.88rem', outline: 'none', transition: 'all .3s ease' 
                }}
                onFocus={() => setFocusContact(true)}
                onBlur={() => setFocusContact(false)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
              {i18n.language === 'ar' ? 'وصف ومواصفات المشروع' : 'Project Description & Details'}
            </label>
            <textarea 
              rows={3} 
              required 
              placeholder={i18n.language === 'ar' ? 'اكتب تفاصيل وميزات المشروع المطلوبة...' : 'Enter project requirements and details...'}
              style={{ 
                width: '100%', padding: '11px 14px', borderRadius: '14px', 
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${focusDetails ? 'rgba(168, 85, 247, 0.8)' : 'rgba(255, 255, 255, 0.12)'}`, 
                boxShadow: focusDetails ? '0 0 16px rgba(168, 85, 247, 0.3)' : 'none',
                color: 'var(--text)', fontFamily: 'inherit', fontSize: '.88rem', outline: 'none', resize: 'vertical', transition: 'all .3s ease' 
              }}
              onFocus={() => setFocusDetails(true)}
              onBlur={() => setFocusDetails(false)}
            />
          </div>

          <button type="submit" className="cta-btn" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '.95rem', boxShadow: '0 0 25px rgba(168, 85, 247, 0.35)' }}>
            <span>{i18n.language === 'ar' ? 'إرسال طلب المشروع الآن' : 'Submit Project Request Now'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );

};
