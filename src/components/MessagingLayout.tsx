"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/lib/mock-data';
import { mockMessageGroups, mockMessages } from '@/lib/messaging-mock-data';
import type { ChatGroup, Message } from '@/lib/messaging-mock-data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, Search } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';


export default function MessagingLayout() {
    const { user } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
    const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const filteredGroups = useMemo(() => {
        if (!user) return [];

        let availableGroups: ChatGroup[] = [];

        if (user.role === 'Admin') {
            availableGroups = mockMessageGroups;
        } else if (user.role === 'HOD') {
            availableGroups = mockMessageGroups.filter(g => g.department === user.department);
        } else if (user.role === 'Faculty' || user.role === 'Advisor') {
            availableGroups = mockMessageGroups.filter(g => 
                g.department === user.department && 
                (g.type === 'class' || g.type === 'faculty')
            );
        } else if (user.role === 'Student') {
            availableGroups = mockMessageGroups.filter(g => 
                g.type === 'class' && g.id === user.classId
            );
        }
        
        if (!searchTerm) {
            return availableGroups;
        }

        return availableGroups.filter(group => 
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    }, [user, searchTerm]);

    useEffect(() => {
        if (filteredGroups.length > 0 && !selectedGroup) {
            setSelectedGroup(filteredGroups[0]);
        }
    }, [filteredGroups, selectedGroup]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedGroup]);


    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedGroup || !user) return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            groupId: selectedGroup.id,
            senderId: user.id,
            content: newMessage,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => {
            const groupMessages = prev[selectedGroup.id] ? [...prev[selectedGroup.id], message] : [message];
            return { ...prev, [selectedGroup.id]: groupMessages };
        });

        setNewMessage('');
    };

    const getSender = (senderId: string) => {
        return mockUsers.find(u => u.id === senderId);
    };

    if (!user) {
        return <div className="p-4">Loading...</div>;
    }

    const currentMessages = selectedGroup ? messages[selectedGroup.id] || [] : [];

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))]">
            {/* Left Panel: Group List */}
            <div className="w-1/3 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold">Groups</h2>
                    <div className="relative mt-2">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search groups..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    {filteredGroups.map(group => (
                        <div
                            key={group.id}
                            className={cn(
                                "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted",
                                selectedGroup?.id === group.id && "bg-accent"
                            )}
                            onClick={() => setSelectedGroup(group)}
                        >
                            <Avatar>
                                <AvatarImage src={group.imageUrl} />
                                <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{group.name}</p>
                                <p className="text-xs text-muted-foreground">{group.type === 'class' ? 'Class' : 'Faculty'} Group</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Right Panel: Chat Window */}
            <div className="w-2/3 flex flex-col bg-muted/30">
                {selectedGroup ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
                            <Avatar>
                                <AvatarImage src={selectedGroup.imageUrl} />
                                <AvatarFallback>{selectedGroup.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">{selectedGroup.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedGroup.department}</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {currentMessages.map(msg => {
                                    const sender = getSender(msg.senderId);
                                    const isCurrentUser = msg.senderId === user.id;
                                    return (
                                        <div key={msg.id} className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                                            {!isCurrentUser && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={sender?.imageUrl} />
                                                    <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "max-w-md p-3 rounded-2xl",
                                                isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card rounded-bl-none"
                                            )}>
                                                {!isCurrentUser && <p className="text-xs font-bold mb-1 text-primary-orange">{sender?.name}</p>}
                                                <p>{msg.content}</p>
                                                <p className="text-xs text-muted-foreground mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            {isCurrentUser && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.imageUrl} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t border-border bg-card">
                            <div className="flex items-center gap-2">
                                <Input 
                                    placeholder="Type a message..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button size="icon" onClick={handleSendMessage}>
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mb-4" />
                        <h2 className="text-xl font-semibold">Select a group to start messaging</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
