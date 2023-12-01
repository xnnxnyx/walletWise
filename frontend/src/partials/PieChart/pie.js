import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Stack } from '@mui/material';
import Card from '../../partials/Cards/cards';

export default function Pie( { category, spent, remaining } ) {
  const [identifier, setIdentifier] = React.useState(null);
  const [id, setId] = React.useState(undefined);



  // Generate items array from category map
  const items = [
    { value: spent, label: "Spent" },
    { value: remaining, label: "Remaning" },
  ];

  return (
    <Card>
    <Stack
      direction={{ xs: 'column', md: 'column' }}
      alignItems={{ xs: 'center', md: 'center' }}
      justifyContent="space-between"
      sx={{ width: '100%' }}
    >

    <Typography style={{ color: 'blue', fontSize: '16px', textAlign: 'left' }}>{category}</Typography>

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
