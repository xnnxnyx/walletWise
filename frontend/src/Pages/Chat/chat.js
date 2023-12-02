import React from 'react';
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import Search from '../../partials/Search/search';
import { requestJA } from '../../api.mjs';

export const ChatPage = () => {
  // Define card titles and content
  const cardInfo = [
    { title: 'Profile', content: 'Your profile information goes here.' },
    { title: 'Joint Accounts', content: 'Information about joint accounts goes here.' },
    { title: 'Friend Requests', content: 'Pending friend requests will be displayed here.' },
    { title: 'Sent Requests', content: 'List of sent friend requests and requests sent by you.' },
  ];

  const [searchValue, setSearchValue] = React.useState('');

  const handleSendClick = () => {
    setSearchValue('');
    if (searchValue) {
      requestJA(searchValue, (err, result) => {
        if (err) {
          console.error("Error sending request:", err);
          // Handle error, e.g., show an error message
        } else {
          console.log("Request sent successfully");
          // Handle success, e.g., show a success message
        }
      });
    } else {
      // Handle the case where searchValue is empty, e.g., show a message to enter a username
      console.warn("Please enter a username before sending the request");
    }
  };


  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar />
          <div className="middle">
            {/* {cardInfo.map((card, index) => (
              <Card key={index}>
                <h2 className="category">{card.title}</h2>
                <div className="four">
                  <p>{card.content}</p>
                </div>
              </Card>
            ))} */}
            <Card key ={1}>
              <h2 className="category">Profile</h2>
              <div className="four">
                  <p>Your profile information goes here.</p>
              </div>
            </Card>
            <Card key ={2}>
              <h2 className="category">Joint Accounts</h2>
              <div className="four">
                  <p>Information about joint accounts goes here.</p>
              </div>
            </Card>
            <Card key ={3}>
              <h2 className="category">Friend Requests</h2>
              <div className="four">
                  <p>Pending friend requests will be displayed here.</p>
              </div>
            </Card>
            <Card key ={4}>
              <h2 className="category">Sent Requests</h2>
              <div className="four">
                  <p>List of sent friend requests and requests sent by you.</p>
                  <Search onChange={(value)=>setSearchValue(value)}></Search>
                  {searchValue && (
                  <button onClick={handleSendClick} >
                    Send
                  </button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;