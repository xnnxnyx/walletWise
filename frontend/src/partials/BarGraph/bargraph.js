import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BG({ categories, amounts }) {
  
    return (
      <>
        {categories === undefined || amounts === undefined || categories.length === 0 || amounts.length === 0 ? (
          <div className='grid grid-rows-4 gap-4 ml-4 place-items-center'>No spendings</div>
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
  