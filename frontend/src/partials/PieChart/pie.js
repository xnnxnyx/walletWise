import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Stack } from '@mui/material';
import Card from '../../partials/Cards/cards';

export default function Pie({ category, spent, remaining }) {
  const items = [
    { value: spent, label: 'Spent', color: '#BFB8DA' },
    { value: remaining, label: 'Remaining', color: '#F3DBCF' },
  ];

  return (
    <Card>
      <Stack
        direction={{ xs: 'column', md: 'column' }}
        alignItems={{ xs: 'center', md: 'center' }}
        justifyContent="space-between"
        sx={{ width: '100%', marginTop: '20px' }}
      >
        <Typography
          style={{
            color: '#0D0447',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '25px',
            fontStyle: 'normal',
            fontWeight: '550',
          }}
        >
          {category}
        </Typography>

        <PieChart
          series={[
            {
              data: items,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          width={400}
          height={200}
          margin={{ right: 200 }}
        />
      </Stack>
    </Card>
  );
}
