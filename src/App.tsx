/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Download, 
  LogOut, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn_080(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
interface UserProfile_080 {
  avatar: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  classGroup: string;
  hobbies: string;
  title: string;
  education: string;
  signature: string;
  loyalty: number;
}

interface UserData_080 {
  password?: string;
  profile: UserProfile_080;
}

interface UsersStore_080 {
  [key: string]: UserData_080;
}

export default function App_080() {
  const [page_080, setPage_080] = useState<'landing' | 'login' | 'register' | 'profile-setup' | 'workbench'>('landing');
  const [users_080, setUsers_080] = useState<UsersStore_080>(() => {
    const saved_080 = localStorage.getItem('users_080');
    return saved_080 ? JSON.parse(saved_080) : {};
  });
  const [currentUser_080, setCurrentUser_080] = useState<string | null>(() => {
    return sessionStorage.getItem('loggedInUser_080');
  });

  const cardRef_080 = useRef<HTMLDivElement>(null);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('users_080', JSON.stringify(users_080));
  }, [users_080]);

  // Handle Login
  const handleLogin_080 = (studentId_080: string, pass_080: string): boolean => {
    const user_080 = users_080[studentId_080];
    if (user_080 && user_080.password === pass_080) {
      setCurrentUser_080(studentId_080);
      sessionStorage.setItem('loggedInUser_080', studentId_080);
      if (user_080.profile && Object.keys(user_080.profile).length > 0 && user_080.profile.name) {
        setPage_080('workbench');
      } else {
        setPage_080('profile-setup');
      }
      return true;
    }
    return false;
  };

  // Handle Register
  const handleRegister_080 = (studentId_080: string, pass_080: string): boolean => {
    if (users_080[studentId_080]) {
      return false;
    }
    const newUsers_080: UsersStore_080 = { 
      ...users_080, 
      [studentId_080]: { 
        password: pass_080, 
        profile: {
          avatar: '',
          name: '',
          email: '',
          age: '',
          gender: '男',
          classGroup: '',
          hobbies: '',
          title: '学生',
          education: '本科',
          signature: '',
          loyalty: 50
        } 
      } 
    };
    setUsers_080(newUsers_080);
    setCurrentUser_080(studentId_080);
    sessionStorage.setItem('loggedInUser_080', studentId_080);
    setPage_080('profile-setup');
    return true;
  };

  // Handle Logout
  const handleLogout_080 = () => {
    setCurrentUser_080(null);
    sessionStorage.removeItem('loggedInUser_080');
    setPage_080('landing');
  };

  // Handle Profile Update
  const updateProfile_080 = (profile_080: UserProfile_080) => {
    if (!currentUser_080) return;
    const newUsers_080 = {
      ...users_080,
      [currentUser_080]: {
        ...users_080[currentUser_080],
        profile: profile_080
      }
    };
    setUsers_080(newUsers_080);
    setPage_080('workbench');
  };

  const currentProfile_080 = currentUser_080 ? users_080[currentUser_080]?.profile : null;

  return (
    <div className="bg-blobs min-h-screen flex flex-col items-center pt-24 pb-12 px-4">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <a href="#" onClick={() => setPage_080('landing')} className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Zap className="w-6 h-6 fill-zinc-900" />
            三杯橘080 Profile Card
          </a>
          <div className="flex items-center gap-6">
            {currentUser_080 ? (
              <>
                <span className="text-sm text-zinc-500 font-medium">Hi, {users_080[currentUser_080]?.profile?.name || currentUser_080}</span>
                <button onClick={handleLogout_080} className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> 退出
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setPage_080('login')} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">登录</button>
                <button onClick={() => setPage_080('register')} className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all">开始使用</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {page_080 === 'landing' && <LandingPage_080 key="landing" onLogin={() => setPage_080('login')} onRegister={() => setPage_080('register')} />}
        {page_080 === 'login' && <LoginPage_080 key="login" onLogin={handleLogin_080} onGoRegister={() => setPage_080('register')} />}
        {page_080 === 'register' && <RegisterPage_080 key="register" onRegister={handleRegister_080} onGoLogin={() => setPage_080('login')} />}
        {page_080 === 'profile-setup' && <ProfileSetupPage_080 key="setup" initialData={currentProfile_080} onSave={updateProfile_080} />}
        {page_080 === 'workbench' && <WorkbenchPage_080 key="workbench" profile={currentProfile_080!} onSave={updateProfile_080} cardRef={cardRef_080} />}
      </AnimatePresence>

      <footer className="mt-12 text-center text-zinc-400 text-xs">
        <p>© 2026 Profile Project _080. All rights reserved.</p>
        <p className="mt-1">Designed with Apple-style aesthetics.</p>
      </footer>
    </div>
  );
}

// --- Components ---

interface LandingPageProps_080 {
  onLogin: () => void;
  onRegister: () => void;
  key?: string;
}
function LandingPage_080({ onLogin, onRegister }: LandingPageProps_080) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl w-full text-center py-20"
    >
      <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent">
        打造你的专属数字名片
      </h1>
      <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        极简设计，极致体验。只需几秒钟，即可生成一张极具设计感的个人数字名片，随时随地分享你的专业形象。
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button onClick={onLogin} className="bg-zinc-900 text-white px-10 py-5 rounded-2xl text-xl font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-zinc-200">
          登录 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <button onClick={onRegister} className="bg-white text-zinc-900 border border-zinc-200 px-10 py-5 rounded-2xl text-xl font-semibold hover:bg-zinc-50 transition-all">
          注册
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
        {[
          { icon: <ShieldCheck className="w-8 h-8 text-zinc-900" />, title: "安全存储", desc: "本地存储技术，确保你的数据只留在你的设备上。" },
          { icon: <Zap className="w-8 h-8 text-zinc-900" />, title: "瞬间生成", desc: "实时预览，所见即所得，快速导出高清名片图片。" },
          { icon: <Layout className="w-8 h-8 text-zinc-900" />, title: "精美模板", desc: "遵循 Apple 设计规范，提供极致的视觉美感。" }
        ].map((f_080, i_080) => (
          <div key={i_080} className="bg-white/60 backdrop-blur-lg border border-zinc-100 p-8 rounded-3xl text-left hover:shadow-2xl hover:shadow-zinc-100 transition-all border-b-4 border-b-zinc-900/5">
            {f_080.icon}
            <h3 className="text-xl font-bold mt-4 mb-2">{f_080.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{f_080.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface LoginPageProps_080 {
  onLogin: (id: string, pass: string) => boolean;
  onGoRegister: () => void;
  key?: string;
}
function LoginPage_080({ onLogin, onGoRegister }: LoginPageProps_080) {
  const [id_080, setId_080] = useState('');
  const [pass_080, setPass_080] = useState('');
  const [error_080, setError_080] = useState('');

  const handleSubmit_080 = (e_080: React.FormEvent) => {
    e_080.preventDefault();
    const success_080 = onLogin(id_080, pass_080);
    if (!success_080) {
      setError_080('学号或密码错误，请重试');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="container_080 max-w-md"
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-zinc-900">欢迎回来</h2>
        <p className="text-lg text-zinc-500 mt-3">请输入你的学号和密码登录</p>
      </div>
      <form onSubmit={handleSubmit_080} className="space-y-8">
        {error_080 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-xl text-base font-medium flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-600" />
            {error_080}
          </motion.div>
        )}
        <div className="space-y-3">
          <label className="text-base font-semibold text-zinc-700 flex items-center gap-2">
            <User className="w-5 h-5" /> 学号
          </label>
          <input 
            type="text" 
            required 
            value={id_080}
            onChange={(e_080) => { setId_080(e_080.target.value); setError_080(''); }}
            className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-lg"
            placeholder="请输入学号"
          />
        </div>
        <div className="space-y-3">
          <label className="text-base font-semibold text-zinc-700 flex items-center gap-2">
            <Lock className="w-5 h-5" /> 密码
          </label>
          <input 
            type="password" 
            required 
            value={pass_080}
            onChange={(e_080) => { setPass_080(e_080.target.value); setError_080(''); }}
            className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-lg"
            placeholder="请输入密码"
          />
        </div>
        <button type="submit" className="w-full bg-zinc-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
          登录
        </button>
      </form>
      <p className="text-center mt-8 text-base text-zinc-500">
        还没有账号？ <button onClick={onGoRegister} className="text-zinc-900 font-bold hover:underline">立即注册</button>
      </p>
    </motion.div>
  );
}

interface RegisterPageProps_080 {
  onRegister: (id: string, pass: string) => boolean;
  onGoLogin: () => void;
  key?: string;
}
function RegisterPage_080({ onRegister, onGoLogin }: RegisterPageProps_080) {
  const [id_080, setId_080] = useState('');
  const [pass_080, setPass_080] = useState('');
  const [confirm_080, setConfirm_080] = useState('');
  const [error_080, setError_080] = useState('');

  const handleSubmit_080 = (e_080: React.FormEvent) => {
    e_080.preventDefault();
    if (pass_080 !== confirm_080) {
      setError_080('两次输入的密码不一致！');
      return;
    }
    const success_080 = onRegister(id_080, pass_080);
    if (!success_080) {
      setError_080('该学号已被注册！');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="container_080 max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">创建账号</h2>
        <p className="text-zinc-500 mt-2">开启你的名片设计之旅</p>
      </div>
      <form onSubmit={handleSubmit_080} className="space-y-5">
        {error_080 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            {error_080}
          </motion.div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">学号</label>
          <input 
            type="text" 
            required 
            value={id_080}
            onChange={(e_080) => { setId_080(e_080.target.value); setError_080(''); }}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            placeholder="设置你的学号"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">设置密码</label>
          <input 
            type="password" 
            required 
            value={pass_080}
            onChange={(e_080) => { setPass_080(e_080.target.value); setError_080(''); }}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            placeholder="至少6位字符"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">确认密码</label>
          <input 
            type="password" 
            required 
            value={confirm_080}
            onChange={(e_080) => { setConfirm_080(e_080.target.value); setError_080(''); }}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            placeholder="再次输入密码"
          />
        </div>
        <button type="submit" className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
          注册并继续
        </button>
      </form>
      <p className="text-center mt-6 text-sm text-zinc-500">
        已有账号？ <button onClick={onGoLogin} className="text-zinc-900 font-bold hover:underline">立即登录</button>
      </p>
    </motion.div>
  );
}

interface ProfileSetupPageProps_080 {
  initialData: UserProfile_080 | null;
  onSave: (p_080: UserProfile_080) => void;
  key?: string;
}
function ProfileSetupPage_080({ initialData, onSave }: ProfileSetupPageProps_080) {
  const [formData_080, setFormData_080] = useState<UserProfile_080>(initialData || {
    avatar: '',
    name: '',
    email: '',
    age: '',
    gender: '男',
    classGroup: '',
    hobbies: '',
    title: '学生',
    education: '本科',
    signature: '',
    loyalty: 50
  });

  const handleAvatarChange_080 = (e_080: React.ChangeEvent<HTMLInputElement>) => {
    const file_080 = e_080.target.files?.[0];
    if (file_080) {
      const reader_080 = new FileReader();
      reader_080.onload = (ev_080) => {
        setFormData_080(prev_080 => ({ ...prev_080, avatar: ev_080.target?.result as string }));
      };
      reader_080.readAsDataURL(file_080);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container_080 max-w-2xl"
    >
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tight">完善个人资料</h2>
        <p className="text-xl text-zinc-500 mt-3">这些信息将展示在你的名片上</p>
      </div>
      <form onSubmit={(e_080) => { e_080.preventDefault(); onSave(formData_080); }} className="space-y-10">
        {/* Avatar Upload */}
        <div className="flex items-center gap-8 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
          <div className="relative w-32 h-32 bg-zinc-200 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
            {formData_080.avatar ? (
              <img src={formData_080.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-zinc-900 mb-2">个人头像</h4>
            <p className="text-sm text-zinc-400 mb-4">建议上传正方形照片，支持 JPG, PNG 格式</p>
            <label className="inline-block bg-white border border-zinc-200 px-6 py-3 rounded-xl text-base font-semibold cursor-pointer hover:bg-zinc-50 transition-colors">
              选择照片
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange_080} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">真实姓名</label>
            <input 
              type="text" required value={formData_080.name}
              onChange={(e_080) => setFormData_080({ ...formData_080, name: e_080.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
              placeholder="你的名字"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">电子邮箱</label>
            <input 
              type="email" required value={formData_080.email}
              onChange={(e_080) => setFormData_080({ ...formData_080, email: e_080.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
              placeholder="example@mail.com"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">年龄</label>
            <input 
              type="number" required value={formData_080.age}
              onChange={(e_080) => setFormData_080({ ...formData_080, age: e_080.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">班级</label>
            <input 
              type="text" required value={formData_080.classGroup}
              onChange={(e_080) => setFormData_080({ ...formData_080, classGroup: e_080.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
              placeholder="如：计算机2201"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">性别</label>
            <div className="flex gap-6 py-4">
              {['男', '女'].map(g_080 => (
                <label key={g_080} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" name="gender" value={g_080} checked={formData_080.gender === g_080}
                    onChange={(e_080) => setFormData_080({ ...formData_080, gender: e_080.target.value })}
                    className="w-5 h-5 accent-zinc-900"
                  />
                  <span className="text-lg font-medium">{g_080}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-base font-semibold text-zinc-700">个性签名</label>
          <textarea 
            rows={3} value={formData_080.signature}
            onChange={(e_080) => setFormData_080({ ...formData_080, signature: e_080.target.value })}
            className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none resize-none text-lg"
            placeholder="一句话介绍你自己..."
          />
        </div>

        <button type="submit" className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
          保存并进入工作台
        </button>
      </form>
    </motion.div>
  );
}

interface WorkbenchPageProps_080 {
  profile: UserProfile_080;
  onSave: (p_080: UserProfile_080) => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
  key?: string;
}
function WorkbenchPage_080({ profile, onSave, cardRef }: WorkbenchPageProps_080) {
  const [formData_080, setFormData_080] = useState<UserProfile_080>({
    avatar: profile.avatar || '',
    name: profile.name || '',
    email: profile.email || '',
    age: profile.age || '',
    gender: profile.gender || '男',
    classGroup: profile.classGroup || '',
    hobbies: profile.hobbies || '',
    title: profile.title || '学生',
    education: profile.education || '本科',
    signature: profile.signature || '',
    loyalty: profile.loyalty ?? 50
  });

  const [isDownloading_080, setIsDownloading_080] = useState(false);
  const [downloadError_080, setDownloadError_080] = useState<string | null>(null);

  const handleDownload_080 = async () => {
    if (cardRef.current && !isDownloading_080) {
      setIsDownloading_080(true);
      setDownloadError_080(null);
      try {
        // Give a small delay to ensure all styles are applied
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas_080 = await html2canvas(cardRef.current, { 
          useCORS: true,
          allowTaint: false,
          scale: 2,
          backgroundColor: '#1e293b', // Match the card background
          logging: true,
          width: cardRef.current.offsetWidth,
          height: cardRef.current.offsetHeight
        });
        
        const dataUrl_080 = canvas_080.toDataURL('image/png');
        const link_080 = document.createElement('a');
        link_080.href = dataUrl_080;
        link_080.download = `名片_${formData_080.name || '未命名'}.png`;
        document.body.appendChild(link_080);
        link_080.click();
        document.body.removeChild(link_080);
      } catch (err_080) {
        console.error("Download failed:", err_080);
        setDownloadError_080("生成图片失败，请稍后重试。");
      } finally {
        setIsDownloading_080(false);
      }
    }
  };

  const handleInputChange_080 = (e_080: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e_080.target;
    setFormData_080(prev_080 => ({ ...prev_080, [id]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="workbench-container_080 w-full max-w-6xl px-4"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Form Panel */}
        <div className="flex-1 w-full space-y-8">
          <div className="form-section_080">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold">编辑名片信息</h3>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">姓名</label>
                  <input id="name" type="text" value={formData_080.name} onChange={handleInputChange_080} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">职称</label>
                  <input id="title" type="text" value={formData_080.title} onChange={handleInputChange_080} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">学历</label>
                  <select id="education" value={formData_080.education} onChange={handleInputChange_080} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none">
                    {['专科', '本科', '硕士', '博士'].map(e_080 => <option key={e_080} value={e_080}>{e_080}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">年龄</label>
                  <input id="age" type="number" value={formData_080.age} onChange={handleInputChange_080} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">班级</label>
                  <input id="classGroup" type="text" value={formData_080.classGroup} onChange={handleInputChange_080} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">兴趣爱好</label>
                <input id="hobbies" type="text" value={formData_080.hobbies} onChange={handleInputChange_080} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="用逗号分隔，如：摄影, 编程, 旅游" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">个性签名</label>
                <textarea id="signature" rows={2} value={formData_080.signature} onChange={handleInputChange_080} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">忠诚度 / 活跃度</label>
                  <span className="text-xs font-bold text-zinc-900">{formData_080.loyalty}%</span>
                </div>
                <input 
                  id="loyalty" type="range" min="0" max="100" value={formData_080.loyalty} 
                  onChange={(e_080) => setFormData_080({ ...formData_080, loyalty: parseInt(e_080.target.value) })}
                  className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" onClick={() => onSave(formData_080)}
                  className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all"
                >
                  更新档案
                </button>
                <button 
                  type="button" onClick={handleDownload_080}
                  disabled={isDownloading_080}
                  className="flex-1 bg-white border border-zinc-200 text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading_080 ? (
                    <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isDownloading_080 ? '生成中...' : '下载名片'}
                </button>
              </div>
              {downloadError_080 && (
                <p className="text-red-500 text-xs mt-2 text-center font-medium">{downloadError_080}</p>
              )}
            </form>
          </div>
        </div>

        {/* Card Preview Panel */}
        <div className="flex-1 w-full sticky top-24">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Layout className="w-5 h-5" /> 实时预览
            </h3>
            <span className="text-xs font-medium text-zinc-400">ID CARD V2.0</span>
          </div>

          <div ref={cardRef} className="business-card_080">
            <div className="card-photo-section_080">
              <img 
                src={formData_080.avatar || 'https://picsum.photos/seed/avatar/400/500'} 
                alt="Avatar" 
                className="card-avatar_080"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="card-info-section_080">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-1">{formData_080.name || '您的姓名'}</h2>
                <p className="text-lg text-emerald-400 font-bold tracking-[0.2em] uppercase">{formData_080.title || '学生'}</p>
              </div>

              <div className="info-grid_080">
                <div className="info-item_080">
                  <span className="info-label_080">年龄 / AGE</span>
                  <span className="info-value_080">{formData_080.age || 'N/A'}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">性别 / GENDER</span>
                  <span className="info-value_080">{formData_080.gender}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">班级 / CLASS</span>
                  <span className="info-value_080">{formData_080.classGroup || '未填写'}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">学历 / EDUCATION</span>
                  <span className="info-value_080">{formData_080.education}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">爱好 / HOBBIES</span>
                  <span className="info-value_080">{formData_080.hobbies || '无'}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">邮箱 / EMAIL</span>
                  <span className="info-value_080">{formData_080.email || 'example@mail.com'}</span>
                </div>
              </div>

              <div className="card-footer_080 mt-4">
                <p className="text-sm text-zinc-400 italic mb-4">"{formData_080.signature || '这个人很酷，什么都没留下...'}"</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Loyalty Level</span>
                  <span className="text-[10px] font-bold text-zinc-300">{formData_080.loyalty}%</span>
                </div>
                <div className="loyalty-bar_080">
                  <div className="loyalty-fill_080" style={{ width: `${formData_080.loyalty}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-zinc-900 rounded-3xl text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <h4 className="font-bold">提示</h4>
              <p className="text-sm text-zinc-400">点击“下载名片”即可保存高清 PNG 图片到本地。</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
