// // import './chat.css';
// // import '../theme.css';
// // import '../../partials/sidebar.css'
// // import Sidebar from '../../partials/sidebar';
// // import React from "react";

// // export const ChatPage = () =>{
    
// //     return (
// //     <div className="screen">
// //       <div className="page">
// //         <div className="center">
// //         <Sidebar/>
// //         </div>
// //       </div>
// //     </div>
// //     );
// // };

// // export default ChatPage;

// import React from 'react';
// import Sidebar from '../../partials/sidebar';
// import Card from '../../partials/Cards/cards';

// export const ChatPage = () => {
//   // Define card titles and content
//   const cardInfo = [
//     { title: 'Profile', content: 'Your profile information goes here.' },
//     { title: 'Joint Accounts', content: 'Information about joint accounts goes here.' },
//     { title: 'Friend Requests', content: 'Pending friend requests will be displayed here.' },
//     { title: 'Sent Requests', content: 'List of sent friend requests and requests sent by you.' },
//   ];

//   return (
//     <div className="screen">
//       <div className="page">
//         <div className="center">
//           <Sidebar />
//           <div className="middle">
//             {cardInfo.map((card, index) => (
//               <Card key={index}>
//                 <h2 className="category">{card.title}</h2>
//                 <div className="four">
//                   <p>{card.content}</p>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// 
import React from 'react';
import { Editable, EditableInput, EditablePreview, useEditableControls } from '@chakra-ui/react';
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';

function EditableControls({ isProfile }) {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

  if (isProfile) {
    return (
      <>
        {isEditing ? (
          <>
            <button {...getSubmitButtonProps()}>Submit</button>
            <button {...getCancelButtonProps()}>Cancel</button>
          </>
        ) : (
          <button {...getEditButtonProps()}>Edit</button>
        )}
      </>
    );
  }

  return null; // Render nothing for non-profile cards
}

const ChatPage = () => {
  // Define card titles and content
  const cardInfo = [
    { title: 'Profile', content: 'Your profile information goes here.' },
    { title: 'Joint Accounts', content: 'Information about joint accounts goes here.' },
    { title: 'Friend Requests', content: 'Pending friend requests will be displayed here.' },
    { title: 'Sent Requests', content: 'List of sent friend requests and requests sent by you.' },
  ];

  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar />
          <div className="middle">
            {cardInfo.map((card, index) => (
              <Card key={index}>
                <h2 className="category">{card.title}</h2>
                <div className="four">
                  <Editable defaultValue={card.content}>
                    <EditablePreview />
                    <EditableInput />
                    <EditableControls isProfile={card.title === 'Profile'} />
                  </Editable>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

