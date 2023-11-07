// import Image from 'next/image'
// import styles from './page.module.css'

// export default function Home() {
//   return (<></>
//   )
// }


// 'use client'

// import styles from './page.module.css'

// export default function Home() {

//     return (
//         <div className={`${styles.hello}`}>
//           Hello World!
//         </div>
//     );
// }

'use client'

import  React, { useState, useEffect } from 'react';
import styles from './page.module.css'
import { AddMessageForm } from './components/AddMessageForm/AddMessagesForm';
import { Messages } from './components/Messages/Messages';

export default function Home() {

  //const [messages, setMessages] = useState([]);
  //const [message, setMessage] = userState([]);

    
    // useEffect(() => {
    //   //getItems().then(setItems);
    // }, [])

    return (
        <AddMessageForm/>
        // <Messages/>
    );
}

