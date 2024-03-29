import {ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { db } from '../firebase';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';

type Props = {
    id:string;
}

const ChatRow = ({id}:Props) => {

    const pathname = usePathname();
    const router = useRouter();
    const {data:session} = useSession();
    const [active, setActive] = useState(false);
    const [messages] = useCollection(
        query(collection(db, 'users', session?.user?.email!, 'chats',id,'messages'),
        orderBy('createdAt','asc'))
    );

    const removeChat = async ()=>{
        await deleteDoc(doc(db,"users", session?.user?.email!, 'chats',id))
        router.replace("/")
    }

    useEffect(() => {
        if(!pathname) return;
        setActive(pathname.includes(id));
    },[pathname])
  return (
    <div>
        <Link href={`/chat/${id}`}  className={`m-2 chatRow justify-center ${active && 'bg-gray-700/50'}`}>
            
            <ChatBubbleLeftIcon className='h-6 w-6 text-white'/>
            <p className='flex-1 hidden md:inline-flex truncate'>
                {messages?.docs[messages?.docs.length -1]?.data().text || "New Chat"}
            </p>
            <TrashIcon onClick={removeChat} className='h-5 w-5 text-gray-700 hover:text-red-700'/>
        </Link>

    </div>
  )
}

export default ChatRow