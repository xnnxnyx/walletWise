// import React from 'react';

// function Card() {
//     return(
//         <div className='cards'>
//         </div>
//     )
// }

// export default Card;

// Card.js
import React from 'react';

function Card({ children }) {
    return (
        <div className='cards'>
            {children}
        </div>
    );
}

export default Card;
