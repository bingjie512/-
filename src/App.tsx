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
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
interface UserProfile {
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

interface UserData {
  password?: string;
  profile: UserProfile;
}

interface UsersStore {
  [key: string]: UserData;
}

export default function App() {
  const [page, setPage] = useState<'landing' | 'login' | 'register' | 'profile-setup' | 'workbench'>('landing');
  const [users, setUsers] = useState<UsersStore>(() => {
    const saved = localStorage.getItem('users_080');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return sessionStorage.getItem('loggedInUser_080');
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('users_080', JSON.stringify(users));
  }, [users]);

  // Handle Login
  const handleLogin = (studentId: string, pass: string): boolean => {
    const user = users[studentId];
    if (user && user.password === pass) {
      setCurrentUser(studentId);
      sessionStorage.setItem('loggedInUser_080', studentId);
      if (user.profile && Object.keys(user.profile).length > 0 && user.profile.name) {
        setPage('workbench');
      } else {
        setPage('profile-setup');
      }
      return true;
    }
    return false;
  };

  // Handle Register
  const handleRegister = (studentId: string, pass: string): boolean => {
    if (users[studentId]) {
      return false;
    }
    const newUsers: UsersStore = { 
      ...users, 
      [studentId]: { 
        password: pass, 
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
    setUsers(newUsers);
    setCurrentUser(studentId);
    sessionStorage.setItem('loggedInUser_080', studentId);
    setPage('profile-setup');
    return true;
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('loggedInUser_080');
    setPage('landing');
  };

  // Handle Profile Update
  const updateProfile = (profile: UserProfile) => {
    if (!currentUser) return;
    const newUsers = {
      ...users,
      [currentUser]: {
        ...users[currentUser],
        profile
      }
    };
    setUsers(newUsers);
    setPage('workbench');
  };

  const currentProfile = currentUser ? users[currentUser]?.profile : null;

  return (
    <div className="bg-blobs min-h-screen flex flex-col items-center pt-24 pb-12 px-4">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <a href="#" onClick={() => setPage('landing')} className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Zap className="w-6 h-6 fill-zinc-900" />
            三杯橘080 Profile Card
          </a>
          <div className="flex items-center gap-6">
            {currentUser ? (
              <>
                <span className="text-sm text-zinc-500 font-medium">Hi, {users[currentUser]?.profile?.name || currentUser}</span>
                <button onClick={handleLogout} className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> 退出
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setPage('login')} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">登录</button>
                <button onClick={() => setPage('register')} className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all">开始使用</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {page === 'landing' && <LandingPage key="landing" onLogin={() => setPage('login')} onRegister={() => setPage('register')} />}
        {page === 'login' && <LoginPage key="login" onLogin={handleLogin} onGoRegister={() => setPage('register')} />}
        {page === 'register' && <RegisterPage key="register" onRegister={handleRegister} onGoLogin={() => setPage('login')} />}
        {page === 'profile-setup' && <ProfileSetupPage key="setup" initialData={currentProfile} onSave={updateProfile} />}
        {page === 'workbench' && <WorkbenchPage key="workbench" profile={currentProfile!} onSave={updateProfile} cardRef={cardRef} />}
      </AnimatePresence>

      <footer className="mt-12 text-center text-zinc-400 text-xs">
        <p>© 2026 Profile Project _080. All rights reserved.</p>
        <p className="mt-1">Designed with Apple-style aesthetics.</p>
      </footer>
    </div>
  );
}

// --- Components ---

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  key?: string;
}
function LandingPage({ onLogin, onRegister }: LandingPageProps) {
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
        ].map((f, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-lg border border-zinc-100 p-8 rounded-3xl text-left hover:shadow-2xl hover:shadow-zinc-100 transition-all border-b-4 border-b-zinc-900/5">
            {f.icon}
            <h3 className="text-xl font-bold mt-4 mb-2">{f.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface LoginPageProps {
  onLogin: (id: string, pass: string) => boolean;
  onGoRegister: () => void;
  key?: string;
}
function LoginPage({ onLogin, onGoRegister }: LoginPageProps) {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(id, pass);
    if (!success) {
      setError('学号或密码错误，请重试');
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-xl text-base font-medium flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-600" />
            {error}
          </motion.div>
        )}
        <div className="space-y-3">
          <label className="text-base font-semibold text-zinc-700 flex items-center gap-2">
            <User className="w-5 h-5" /> 学号
          </label>
          <input 
            type="text" 
            required 
            value={id}
            onChange={(e) => { setId(e.target.value); setError(''); }}
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
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(''); }}
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

interface RegisterPageProps {
  onRegister: (id: string, pass: string) => boolean;
  onGoLogin: () => void;
  key?: string;
}
function RegisterPage({ onRegister, onGoLogin }: RegisterPageProps) {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass !== confirm) {
      setError('两次输入的密码不一致！');
      return;
    }
    const success = onRegister(id, pass);
    if (!success) {
      setError('该学号已被注册！');
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
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            {error}
          </motion.div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">学号</label>
          <input 
            type="text" 
            required 
            value={id}
            onChange={(e) => { setId(e.target.value); setError(''); }}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            placeholder="设置你的学号"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">设置密码</label>
          <input 
            type="password" 
            required 
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(''); }}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            placeholder="至少6位字符"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">确认密码</label>
          <input 
            type="password" 
            required 
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError(''); }}
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

interface ProfileSetupPageProps {
  initialData: UserProfile | null;
  onSave: (p: UserProfile) => void;
  key?: string;
}
function ProfileSetupPage({ initialData, onSave }: ProfileSetupPageProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData || {
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
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
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-10">
        {/* Avatar Upload */}
        <div className="flex items-center gap-8 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
          <div className="relative w-32 h-32 bg-zinc-200 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">真实姓名</label>
            <input 
              type="text" required value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
              placeholder="你的名字"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">电子邮箱</label>
            <input 
              type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
              placeholder="example@mail.com"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">年龄</label>
            <input 
              type="number" required value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">班级</label>
            <input 
              type="text" required value={formData.classGroup}
              onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-lg"
              placeholder="如：计算机2201"
            />
          </div>
          <div className="space-y-3">
            <label className="text-base font-semibold text-zinc-700">性别</label>
            <div className="flex gap-6 py-4">
              {['男', '女'].map(g => (
                <label key={g} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" name="gender" value={g} checked={formData.gender === g}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-5 h-5 accent-zinc-900"
                  />
                  <span className="text-lg font-medium">{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-base font-semibold text-zinc-700">个性签名</label>
          <textarea 
            rows={3} value={formData.signature}
            onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
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

interface WorkbenchPageProps {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
  key?: string;
}
function WorkbenchPage({ profile, onSave, cardRef }: WorkbenchPageProps) {
  const [formData, setFormData] = useState<UserProfile>({
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

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (cardRef.current && !isDownloading) {
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(cardRef.current, { 
          useCORS: true, 
          scale: 2,
          backgroundColor: null,
          logging: false
        });
        const link = document.createElement('a');
        link.download = `名片_${formData.name || '未命名'}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
                  <input id="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">职称</label>
                  <input id="title" type="text" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">学历</label>
                  <select id="education" value={formData.education} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none">
                    {['专科', '本科', '硕士', '博士'].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">年龄</label>
                  <input id="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">班级</label>
                  <input id="classGroup" type="text" value={formData.classGroup} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">兴趣爱好</label>
                <input id="hobbies" type="text" value={formData.hobbies} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="用逗号分隔，如：摄影, 编程, 旅游" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">个性签名</label>
                <textarea id="signature" rows={2} value={formData.signature} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">忠诚度 / 活跃度</label>
                  <span className="text-xs font-bold text-zinc-900">{formData.loyalty}%</span>
                </div>
                <input 
                  id="loyalty" type="range" min="0" max="100" value={formData.loyalty} 
                  onChange={(e) => setFormData({ ...formData, loyalty: parseInt(e.target.value) })}
                  className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" onClick={() => onSave(formData)}
                  className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all"
                >
                  更新档案
                </button>
                <button 
                  type="button" onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 bg-white border border-zinc-200 text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isDownloading ? '生成中...' : '下载名片'}
                </button>
              </div>
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
                src={formData.avatar || 'https://picsum.photos/seed/avatar/400/500'} 
                alt="Avatar" 
                className="card-avatar_080"
              />
            </div>
            <div className="card-info-section_080">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-1">{formData.name || '您的姓名'}</h2>
                <p className="text-lg text-emerald-400 font-bold tracking-[0.2em] uppercase">{formData.title || '学生'}</p>
              </div>

              <div className="info-grid_080">
                <div className="info-item_080">
                  <span className="info-label_080">年龄 / AGE</span>
                  <span className="info-value_080">{formData.age || 'N/A'}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">性别 / GENDER</span>
                  <span className="info-value_080">{formData.gender}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">班级 / CLASS</span>
                  <span className="info-value_080">{formData.classGroup || '未填写'}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">学历 / EDUCATION</span>
                  <span className="info-value_080">{formData.education}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">爱好 / HOBBIES</span>
                  <span className="info-value_080">{formData.hobbies || '无'}</span>
                </div>
                <div className="info-item_080">
                  <span className="info-label_080">邮箱 / EMAIL</span>
                  <span className="info-value_080">{formData.email || 'example@mail.com'}</span>
                </div>
              </div>

              <div className="card-footer_080 mt-4">
                <p className="text-sm text-zinc-400 italic mb-4">"{formData.signature || '这个人很酷，什么都没留下...'}"</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Loyalty Level</span>
                  <span className="text-[10px] font-bold text-zinc-300">{formData.loyalty}%</span>
                </div>
                <div className="loyalty-bar_080">
                  <div className="loyalty-fill_080" style={{ width: `${formData.loyalty}%` }} />
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
