import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

const contacts = [
  { id: 1, name: 'Mr. Peter Kila', role: 'Mathematics Teacher', avatar: '', online: true, lastMessage: 'Please submit your assignment by Friday', unread: 2 },
  { id: 2, name: 'Dr. Sarah Mondo', role: 'Science Teacher', avatar: '', online: true, lastMessage: 'Great work on the lab report!', unread: 0 },
  { id: 3, name: 'John Wari', role: 'Classmate', avatar: '', online: false, lastMessage: 'Can we study together tomorrow?', unread: 1 },
  { id: 4, name: 'Mrs. Anna Raga', role: 'Literature Teacher', avatar: '', online: false, lastMessage: 'The essay deadline is extended', unread: 0 },
  { id: 5, name: 'David Tau', role: 'Classmate', avatar: '', online: true, lastMessage: 'Did you finish the homework?', unread: 0 },
];

const messages = [
  { id: 1, sender: 'them', text: 'Hello! How can I help you today?', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'Hi Mr. Kila, I have a question about the homework.', time: '10:32 AM' },
  { id: 3, sender: 'them', text: 'Sure, what would you like to know?', time: '10:33 AM' },
  { id: 4, sender: 'me', text: 'I\'m having trouble with problem 5 on page 45.', time: '10:35 AM' },
  { id: 5, sender: 'them', text: 'That\'s a tricky one! Let me explain the concept. First, you need to identify the variables...', time: '10:37 AM' },
  { id: 6, sender: 'them', text: 'Please submit your assignment by Friday', time: '10:45 AM' },
];

export default function MyMessenger() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-6">My Messenger</h1>
      
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Contacts List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedContact.id === contact.id ? 'bg-primary/10 border border-primary' : 'hover:bg-muted'}`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{contact.name}</p>
                        {contact.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{contact.unread}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedContact.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                <Input 
                  placeholder="Type a message..." 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && newMessage.trim() && setNewMessage('')}
                />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
