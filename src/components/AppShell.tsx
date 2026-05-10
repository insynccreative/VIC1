import React, { useState, useEffect } from 'react';
import { useAuth } from './FirebaseProvider';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Member, Community, MemberRole, PrivateMessagingLevel } from '../types';
import { Shield, Plus, MessageSquare, Settings, Users, LogOut, Check, X, ShieldAlert, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'communities'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommunities(comms);
      if (comms.length > 0 && !selectedCommunity) {
        setSelectedCommunity(comms[0]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateCommunity = async () => {
    if (!newCommunityName.trim() || !user) return;

    try {
      const commData = {
        name: newCommunityName,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        settings: {
          blockContacts: true,
          privateMessaging: 'admin-only'
        }
      };

      const docRef = await addDoc(collection(db, 'communities'), commData);
      
      await setDoc(doc(db, `communities/${docRef.id}/members`, user.uid), {
        userId: user.uid,
        displayName: user.displayName || 'Admin',
        role: 'admin',
        joinedAt: serverTimestamp()
      });

      await addDoc(collection(db, `communities/${docRef.id}/channels`), {
        name: 'general',
        description: 'Global announcements and chat',
        createdAt: serverTimestamp()
      });

      setNewCommunityName('');
      setIsCreatingCommunity(false);
    } catch (err) {
      console.error("Error creating community", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans antialiased overflow-hidden">
      {/* Sidebar: Communities list */}
      <aside className="w-20 flex flex-col items-center py-6 border-r border-white/5 bg-[#121212] shrink-0">
        <div className="mb-8 p-3 bg-yellow-500 text-black rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-transform hover:scale-105 active:scale-95">
          <Shield size={24} />
        </div>
        
        <ScrollArea className="flex-1 w-full px-2">
          <div className="space-y-4 flex flex-col items-center">
            {communities.map((comm) => (
              <button
                key={comm.id}
                onClick={() => setSelectedCommunity(comm)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group relative ${
                  selectedCommunity?.id === comm.id 
                  ? 'bg-yellow-500 text-black font-black scale-110 shadow-lg shadow-yellow-500/20' 
                  : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-tight">{comm.name.substring(0, 3)}</span>
                <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-500 rounded-l-full transition-all duration-300 ${
                  selectedCommunity?.id === comm.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'
                }`} />
              </button>
            ))}

            <button 
              onClick={() => setIsCreatingCommunity(true)}
              className="w-12 h-12 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 hover:border-yellow-500/50 hover:text-yellow-500 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </ScrollArea>

        <div className="mt-auto pt-6 space-y-4">
          <button 
            onClick={logout}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
          <Avatar className="w-10 h-10 border-2 border-white/10 ring-1 ring-white/5">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-white/10 text-white/60 font-black text-[10px]">{user?.displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </aside>

      {/* Main Content Area */}
      {isCreatingCommunity ? (
        <main className="flex-1 flex items-center justify-center p-6 bg-[#0A0A0A]">
          <Card className="w-full max-w-md border border-white/5 bg-[#121212] text-white shadow-2xl rounded-[2.5rem] p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[80px] -mr-16 -mt-16" />
            <CardHeader className="p-0 mb-10 relative z-10">
              <div className="text-yellow-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4 italic">Inner Circle Protocol</div>
              <CardTitle className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-3">Launch Space</CardTitle>
              <CardDescription className="text-white/40 text-lg font-medium leading-tight">Define your territory. Set your rules.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Community Name</label>
                <Input 
                  placeholder="e.g. DELHI CREATORS" 
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="rounded-xl border-white/5 bg-white/5 text-white focus:bg-white/10 h-14 text-lg font-bold placeholder:text-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 space-y-3 border border-white/5">
                  <ShieldAlert size={18} className="text-yellow-500" />
                  <div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-white/40">Privacy</div>
                    <div className="text-xs font-bold text-white/80">PII Masking Active</div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 space-y-3 border border-white/5">
                  <Users size={18} className="text-yellow-500" />
                  <div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-white/40">Sovereignty</div>
                    <div className="text-xs font-bold text-white/80">Approval Required</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <Button onClick={handleCreateCommunity} className="w-full h-16 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-yellow-500 transition-all shadow-xl shadow-white/5">
                  Establish Community
                </Button>
                <Button variant="ghost" onClick={() => setIsCreatingCommunity(false)} className="h-12 text-white/30 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      ) : selectedCommunity ? (
        <CommunityDetail community={selectedCommunity} />
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#0A0A0A]">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-white/10 mb-8 shadow-2xl">
            <Shield size={40} />
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4 italic">No Active Gateway</h2>
          <p className="text-white/30 max-w-sm text-lg font-medium">Initialize a sovereign inner circle or await verification from an operator.</p>
          <Button onClick={() => setIsCreatingCommunity(true)} className="mt-12 bg-yellow-500 text-black rounded-full px-10 py-8 h-auto font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(234,179,8,0.2)] hover:scale-105 active:scale-95 transition-all">
            Founder Interface
          </Button>
        </main>
      )}
    </div>
  );
};

interface CommunityDetailProps {
  community: any;
}

const CommunityDetail: React.FC<CommunityDetailProps> = ({ community }) => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'queue' | 'members' | 'settings'>('chat');

  useEffect(() => {
    if (!community?.id || !user) return;

    const checkRole = async () => {
      const docSnap = await getDocs(query(collection(db, `communities/${community.id}/members`), where('userId', '==', user.uid)));
      if (!docSnap.empty) {
        const role = docSnap.docs[0].data().role;
        setIsAdmin(role === 'admin' || role === 'moderator');
      }
    };
    checkRole();

    const unsubscribe = onSnapshot(collection(db, `communities/${community.id}/channels`), (snapshot) => {
      const chans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChannels(chans);
      if (chans.length > 0 && !selectedChannel) {
        setSelectedChannel(chans[0]);
      }
    });

    return () => unsubscribe();
  }, [community.id, user]);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0A0A]">
      {/* Community Channels Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#0F0F0F]">
        <header className="p-6 border-b border-white/5">
          <h2 className="font-black italic uppercase tracking-tighter text-xl mb-1 truncate text-white">{community.name}</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,1)] animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-black text-yellow-500/60 italic">Sovereign Node</span>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-8">
            <div>
              <div className="px-3 mb-4 flex items-center justify-between group">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Channels</span>
                <Plus size={12} className="text-white/30 cursor-pointer hover:text-yellow-500 transition-colors" />
              </div>
              <div className="space-y-1">
                {channels.map(chan => (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setSelectedChannel(chan);
                      setActiveTab('chat');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                      selectedChannel?.id === chan.id && activeTab === 'chat'
                      ? 'bg-yellow-500/10 text-yellow-500 border-l-4 border-yellow-500 shadow-lg' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="font-black italic opacity-30 text-xs">#</span>
                    <span className="font-bold text-sm tracking-tight truncate">{chan.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div>
                <div className="px-3 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Operations</span>
                </div>
                <div className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('queue')}
                    className={`w-full px-3 py-3 rounded-xl flex items-center justify-between gap-3 transition-all ${
                      activeTab === 'queue' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={16} />
                      <span className="font-black uppercase text-[10px] tracking-widest">Pending Queue</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('members')}
                    className={`w-full px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${
                      activeTab === 'members' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Users size={16} />
                    <span className="font-black uppercase text-[10px] tracking-widest">Verify Members</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${
                      activeTab === 'settings' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Settings size={16} />
                    <span className="font-black uppercase text-[10px] tracking-widest">System Control</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <footer className="p-4 mt-auto border-t border-white/5 bg-[#121212]">
           <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 text-white space-y-1 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-100 transition-opacity">
               <Shield size={12} className="text-yellow-500" />
             </div>
             <div className="text-[10px] uppercase tracking-[0.25em] font-black text-yellow-500 italic opacity-80">Encryption: SOVEREIGN</div>
             <div className="text-xs font-black tracking-tight text-white/50">VIC v1.0.4 • B2B NODE</div>
           </div>
        </footer>
      </aside>

      {/* Viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] relative">
         {/* Subtle corner glow */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-[100px] pointer-events-none" />
         
        {activeTab === 'chat' && selectedChannel ? (
          <ChannelChat channel={selectedChannel} communityId={community.id} isAdmin={isAdmin} communitySettings={community.settings} />
        ) : activeTab === 'queue' ? (
          <ApprovalQueue communityId={community.id} />
        ) : activeTab === 'members' ? (
          <MemberManager communityId={community.id} />
        ) : activeTab === 'settings' ? (
          <CircleSettings community={community} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/5">
            <MessageSquare size={120} className="stroke-[0.5]" />
          </div>
        )}
      </main>
    </div>
  );
};

const ChannelChat: React.FC<{ channel: any, communityId: string, isAdmin: boolean, communitySettings: any }> = ({ channel, communityId, isAdmin, communitySettings }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, `communities/${communityId}/channels/${channel.id}/messages`),
      where('status', '==', 'approved')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs.sort((a: any, b: any) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)));
    });

    return () => unsubscribe();
  }, [channel.id]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    try {
      await addDoc(collection(db, `communities/${communityId}/channels/${channel.id}/messages`), {
        content: input,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        status: isAdmin ? 'approved' : 'pending',
        timestamp: serverTimestamp()
      });
      setInput('');
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const formatContent = (content: string) => {
    if (!communitySettings?.blockContacts) return content;
    const phoneRegex = /(\+?\d{1,4}[ \.-]?)?(\(?\d{3}\)?[ \.-]?)?\d{3}[ \.-]?\d{4}/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return content.replace(phoneRegex, '[PHONE MASKED]').replace(emailRegex, '[EMAIL MASKED]');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0A0A0A]">
      <header className="h-16 px-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0F0F0F]/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-yellow-500 italic opacity-50">#</span>
          <h3 className="font-black uppercase tracking-tight text-white">{channel.name}</h3>
          <Separator orientation="vertical" className="h-4 mx-2 bg-white/10" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{channel.description}</span>
        </div>
      </header>

      <ScrollArea className="flex-1 p-8">
        <div className="space-y-10 max-w-4xl mx-auto">
           <div className="py-20 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-yellow-500/20 mb-6 shadow-2xl">
               <MessageSquare size={40} />
             </div>
             <h4 className="text-4xl font-black italic uppercase tracking-tighter">Gateway Initialized</h4>
             <p className="text-white/30 text-sm mt-3 max-w-xs font-medium uppercase tracking-widest leading-relaxed">Secure communication node active. All traffic monitored by community sovereign.</p>
           </div>

           {messages.map((msg, i) => (
             <div key={msg.id} className="group flex gap-5">
               <Avatar className="w-12 h-12 rounded-2xl border border-white/5">
                 <AvatarFallback className="bg-white/5 text-white/40 text-[10px] font-black">{msg.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="space-y-1.5 overflow-hidden">
                 <div className="flex items-center gap-3">
                   <span className="font-black text-sm uppercase tracking-tight text-white">{msg.authorName}</span>
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                     {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                   </span>
                 </div>
                 <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
                   {formatContent(msg.content)}
                 </p>
               </div>
             </div>
           ))}
        </div>
      </ScrollArea>

      <footer className="p-8 shrink-0 border-t border-white/5 bg-[#0F0F0F]/30">
        <div className="max-w-4xl mx-auto relative group">
          <Input 
            className="h-16 rounded-2xl border-white/5 bg-white/5 text-white focus:bg-white/10 focus:ring-0 focus:border-yellow-500/50 pr-14 text-sm font-bold placeholder:text-white/10 transition-all" 
            placeholder={`Message #${channel.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-lg shadow-yellow-500/20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {!isAdmin && (
          <div className="max-w-4xl mx-auto mt-4 px-2 flex items-center gap-2 opacity-30">
             <ShieldAlert size={12} className="text-yellow-500" />
             <span className="text-[10px] uppercase tracking-[0.25em] font-black italic">Protocol: Post Approval Required</span>
          </div>
        )}
      </footer>
    </div>
  );
};

// Simplified views for the POC
const ApprovalQueue: React.FC<{ communityId: string }> = ({ communityId }) => {
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const channelsSnap = await getDocs(collection(db, `communities/${communityId}/channels`));
        const allPending: any[] = [];
        
        for (const channelDoc of channelsSnap.docs) {
          const mSnap = await getDocs(query(
            collection(db, `communities/${communityId}/channels/${channelDoc.id}/messages`),
            where('status', '==', 'pending')
          ));
          mSnap.forEach(mDoc => {
            allPending.push({ 
              id: mDoc.id, 
              channelId: channelDoc.id, 
              channelName: channelDoc.data().name,
              ...mDoc.data() 
            });
          });
        }
        setPendingMessages(allPending);
      } catch (err) {
        console.error("Error fetching pending messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [communityId]);

  const updateStatus = async (msg: any, newStatus: string) => {
    try {
      await setDoc(doc(db, `communities/${communityId}/channels/${msg.channelId}/messages`, msg.id), {
        status: newStatus
      }, { merge: true });
      setPendingMessages(prev => prev.filter(p => p.id !== msg.id));
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-10 overflow-hidden bg-[#0A0A0A]">
      <header className="mb-14 relative z-10">
        <div className="text-yellow-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4 italic">Protocol: Verification</div>
        <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none text-white mb-4">Approval Queue</h2>
        <p className="text-white/40 text-lg font-medium tracking-tight uppercase">Master review required for {pendingMessages.length} transmissions.</p>
      </header>
      
      <ScrollArea className="flex-1 relative z-10">
        {loading ? (
          <div className="py-20 text-center animate-pulse uppercase tracking-[0.4em] font-black text-[10px] text-yellow-500/40 italic italic">Scanning Sub-Nodes...</div>
        ) : pendingMessages.length === 0 ? (
          <Card className="border border-white/5 bg-white/[0.02] rounded-[3.5rem] h-80 flex flex-col items-center justify-center text-center p-12">
            <Check size={64} className="text-yellow-500/20 mb-8 stroke-[1]" />
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white/80">Queue Sanitized</h3>
            <p className="text-white/30 max-w-sm mt-3 text-sm font-medium uppercase tracking-widest">Sovereign control maintained. No pending data.</p>
          </Card>
        ) : (
          <div className="space-y-6 max-w-5xl">
            {pendingMessages.map(msg => (
              <Card key={msg.id} className="group border border-white/5 bg-[#121212] p-8 rounded-[2.5rem] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-all hover:border-white/10 hover:shadow-2xl relative overflow-hidden">
                {/* Background Bold Text Watermark */}
                <div className="absolute -bottom-6 -right-6 text-[120px] font-black text-white/[0.02] pointer-events-none select-none uppercase leading-none italic italic">PENDING</div>
                
                <div className="flex gap-8 flex-1 relative z-10">
                  <Avatar className="w-16 h-16 rounded-[1.5rem] border border-white/5 shadow-2xl">
                    <AvatarFallback className="bg-white/5 text-white/40 font-black text-xs uppercase">{msg.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="font-black text-lg uppercase tracking-tight text-white">{msg.authorName}</span>
                       <Badge className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full italic italic">#{msg.channelName}</Badge>
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">12:04 PM</span>
                    </div>
                    <p className="text-lg text-white/80 font-medium leading-relaxed italic italic">"{msg.content}"</p>
                    
                    <div className="flex gap-4 pt-2">
                       <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                         <span>Links: 0</span>
                       </div>
                       <div className="flex items-center gap-2 text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/10">
                         <span>Safety: Masked</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto relative z-10">
                  <Button 
                    onClick={() => updateStatus(msg, 'approved')}
                    className="flex-1 lg:flex-none h-16 px-10 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-yellow-500 transition-all shadow-xl shadow-white/5 active:scale-95"
                  >
                    Approve Post
                  </Button>
                  <Button 
                    onClick={() => updateStatus(msg, 'rejected')}
                    variant="outline"
                    className="flex-1 lg:flex-none h-16 px-8 border-white/10 text-white/40 bg-transparent rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95"
                  >
                    Reject Circle
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

const MemberManager: React.FC<{ communityId: string }> = ({ communityId }) => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `communities/${communityId}/members`), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [communityId]);

  return (
    <div className="flex-1 flex flex-col p-10 overflow-hidden bg-[#0A0A0A]">
      <header className="mb-14">
        <div className="text-yellow-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4 italic">Inner Circle Roster</div>
        <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none text-white mb-4">The Verfied</h2>
        <p className="text-white/40 text-lg font-medium tracking-tight uppercase">Governing permissions for {members.length} unique identities.</p>
      </header>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {members.map(member => (
            <Card key={member.id} className="border border-white/5 bg-[#121212] rounded-[2.5rem] p-8 space-y-6 hover:border-white/10 transition-all hover:shadow-2xl group">
              <div className="flex items-center gap-5">
                <Avatar className="w-16 h-16 rounded-[1.5rem] border border-white/5 shadow-2xl">
                  <AvatarFallback className="bg-white/5 text-white/40 font-black text-xs uppercase">{member.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-black text-xl uppercase tracking-tight text-white mb-1">{member.displayName}</div>
                  <Badge className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full italic italic">{member.role}</Badge>
                </div>
              </div>
              <Separator className="bg-white/5" />
              <div className="grid grid-cols-2 gap-3">
                <Button variant="ghost" className="h-12 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">Audit</Button>
                <Button variant="ghost" className="h-12 bg-red-500/5 border border-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:bg-red-500 hover:text-black transition-all">Exile</Button>
              </div>
            </Card>
          ))}

          <button className="border-2 border-dashed border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center text-white/10 hover:border-yellow-500/30 hover:text-yellow-500/30 transition-all group bg-white/[0.01]">
             <Plus size={48} className="mb-4 stroke-[1] group-hover:scale-110 transition-transform" />
             <div className="font-black uppercase tracking-[0.3em] text-[10px] italic italic">Issue Invitation</div>
          </button>
        </div>
      </ScrollArea>
    </div>
  );
};

const CircleSettings: React.FC<{ community: any }> = ({ community }) => {
  return (
    <div className="flex-1 flex flex-col p-10 overflow-hidden bg-[#0A0A0A]">
      <header className="mb-14">
        <div className="text-yellow-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4 italic">Node Overrides</div>
        <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none text-white mb-4">Sovereign Controls</h2>
        <p className="text-white/40 text-lg font-medium tracking-tight uppercase">Master control for {community.name} operating parameters.</p>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl space-y-14">
          <section className="space-y-6">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20 italic">Data Privacy Protocols</h4>
             <div className="flex items-center justify-between p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] transition-all hover:border-white/10">
               <div className="space-y-1.5 px-2">
                 <div className="font-black uppercase tracking-tight text-xl">Mask Private Identifiers</div>
                 <div className="text-sm font-medium text-white/30 uppercase italic tracking-tight">Auto-scramble phone numbers and emails.</div>
               </div>
               <div className="w-14 h-7 bg-yellow-500 rounded-full relative shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  <div className="w-5 h-5 bg-black rounded-full absolute right-1 top-1"></div>
               </div>
             </div>
             <div className="flex items-center justify-between p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] transition-all hover:border-white/10">
               <div className="space-y-1.5 px-2">
                 <div className="font-black uppercase tracking-tight text-xl">Private Access Layer</div>
                 <div className="text-sm font-medium text-white/30 uppercase italic tracking-tight">Direct Messaging restriction protocols.</div>
               </div>
               <Badge className="bg-white/5 text-white/40 border-white/10 py-2 px-6 rounded-full font-black text-[10px] tracking-[0.2em]">ADMIN ONLY</Badge>
             </div>
          </section>

          <section className="space-y-6 pb-20">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20 italic">Global Authority</h4>
            <div className="p-10 rounded-[3.5rem] bg-gradient-to-br from-yellow-500 to-yellow-600 text-black space-y-6 shadow-2xl shadow-yellow-500/10">
               <Shield size={48} className="stroke-[2.5]" />
               <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Absolute Sovereignty</h3>
               <p className="text-black/60 text-lg font-bold leading-tight">You hold the root keys to this circle. Your word is law. No post, soul, or data point exists without your clearance.</p>
               <Button variant="secondary" className="w-full mt-6 bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all">Transfer Sovereignty</Button>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};
