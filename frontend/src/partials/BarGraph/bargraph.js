import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BG({ categories, amounts }) {
    // console.log("This is the amount ", amounts);
    // console.log("This is the category count ", categories);
  
    return (
      <>
        {categories.length === 0 || amounts.length === 0 ? (
          <div>Nothing to show here</div>
        ) : (
          <BarChart
            width={500}
            height={300}
            series={[
              { data: amounts, id: 'amounts' },
            ]}
            xAxis={[{ data: categories, scaleType: 'band' }]}
          />
        )}
      </>
    );
  }
  