import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "Min",
  },
  {
    value: 100,
    label: "Max",
  },
];


interface Props {
    fromPricePercent: number | null
    onChange: (e: any) => void,
    disabled: boolean
}

const DiscreteSliderMarks:React.FC<Props> = ({ fromPricePercent, onChange, disabled }) => {

  return (
    <Box className='slider-container' sx={{ width: "60%", padding: "0 20px", margin: "0 auto" }}>
      <Slider
        aria-label="Custom marks"
        defaultValue={0}
        step={5}
        value={disabled ? 0 : fromPricePercent!}
        marks={marks}
        onChange={onChange}
        disabled={disabled}
      />
    </Box>
  );
}
export default DiscreteSliderMarks