// ClosingSlide.tsx — "thanks" faded behind a live pong game
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { StaticOrganicShape } from '../common/MorphingShape';
import { SHAPES } from '../../lib/organic-shapes';
import PongGameDesktop from './PongGameDesktop';
import type { ClosingSlide as ClosingSlideData } from '../../data/slides-data';

// Floating background shapes config
const BG_SHAPES = [
  { shape: SHAPES.bird,    opacity: 0.06, floatAmp: 5,  floatDuration: 11, phase: 0,   style: { left: '2%',  top: '5%',  width: '14%', height: '14%' } },
  { shape: SHAPES.sunBlob, opacity: 0.05, floatAmp: 4,  floatDuration: 14, phase: 0.3, style: { right: '3%', top: '8%',  width: '12%', height: '12%' } },
  { shape: SHAPES.cloud,   opacity: 0.05, floatAmp: 6,  floatDuration: 17, phase: 0.7, style: { left: '8%',  bottom: '10%', width: '16%', height: '16%' } },
  { shape: SHAPES.face,    opacity: 0.04, floatAmp: 3,  floatDuration: 13, phase: 1.1, style: { right: '5%', bottom: '12%', width: '13%', height: '13%' } },
  { shape: SHAPES.man,     opacity: 0.04, floatAmp: 4,  floatDuration: 16, phase: 0.5, style: { left: '20%', top: '3%',  width: '10%', height: '10%' } },
  { shape: SHAPES.sun,     opacity: 0.05, floatAmp: 5,  floatDuration: 12, phase: 1.4, style: { right: '18%', bottom: '5%', width: '11%', height: '11%' } },
  { shape: SHAPES.bird,    opacity: 0.04, floatAmp: 3,  floatDuration: 19, phase: 0.9, style: { right: '22%', top: '5%',  width: '9%',  height: '9%' } },
  { shape: SHAPES.mountain,opacity: 0.04, floatAmp: 4,  floatDuration: 15, phase: 0.2, style: { left: '38%', bottom: '4%', width: '12%', height: '12%' } },
];

export default function ClosingSlide({
  slide,
  onPrev,
}: {
  slide: ClosingSlideData;
  onPrev?: () => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Background floating shapes — z-0 */}
      {BG_SHAPES.map((s, i) => (
        <StaticOrganicShape
          key={i}
          shape={s.shape}
          fill={C.white}
          opacity={s.opacity}
          floatAmp={s.floatAmp}
          floatDuration={s.floatDuration}
          phase={s.phase}
          style={s.style}
        />
      ))}

      {/* "thanks" word-shape — faded to 15%, sits behind the game */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-[82%] max-w-[900px]" style={{ opacity: 0.15 }}>
          <svg
            viewBox="0 0 1354 471"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            style={{ overflow: 'visible' }}
          >
            <path d="M247.492 351.12C247.681 314.198 249.308 262.896 246.451 229.422C231.27 51.5386 15.2007 251.663 1.85888 182.578C-35.7807 -12.3242 510.859 -85.7329 493.833 136.685C488.946 200.52 355.842 140.444 331.029 214.053C321.036 243.698 329.963 290.316 327.551 328.043C324.01 383.42 317.994 431.392 299.853 455.916C296.055 461.051 292.399 463.687 287.94 462.699C277.964 460.488 259.636 454.248 251.631 439.929C248.271 433.919 247.196 409.125 247.492 351.12Z" fill="white"/>
            <path d="M354.324 459.795C347.962 453.855 342.06 447.031 341.84 429.763C341.416 396.603 375.206 132.923 414.323 230.819C422.742 245.963 412.271 288.59 431.073 293.856C460.883 302.205 462.595 227.432 482.998 237.065C537.329 262.714 517.402 398.438 480.328 430.634C416.912 485.705 469.286 326.798 423.673 328.817C420.41 328.962 416.27 331.28 414.978 335.859C407.194 363.453 398.372 454.638 364.33 463.065C361.082 463.87 357.366 462.634 354.324 459.795Z" fill="white"/>
            <path d="M735.161 314.753C739.634 348.16 739.863 353.139 739.863 353.658L742.482 373.771C745.216 379.755 757.656 393.008 771.609 402.978C774.424 403.489 777.402 402.964 779.041 400.288C782.293 394.98 784.461 387.591 785.176 374.747C787.881 326.165 785.149 276.224 794.979 272.323C796.739 271.624 799.317 273.166 801.537 275.863C818.964 297.026 861.126 365.805 884.798 366.588C892.508 366.843 902.321 365.387 910.404 359.251C916.143 354.894 922.472 329.426 916.302 287.277C905.962 216.656 895.957 174.577 882.032 160.773C877.24 156.023 870.222 152.343 863.351 155.507C860.386 156.872 858.15 159.188 857.286 163.374C852.553 186.305 859.252 253.618 842.421 261.276C840.233 262.271 837.539 261.713 834.859 259.702C823.09 250.874 815.542 232.943 792.263 194.881C772.06 161.848 755.428 138.652 740.514 137.37C733.38 136.757 726.346 137.105 723.076 142.926C719.839 148.69 715.654 156.373 714.871 166.158C714.158 175.082 724.221 233.061 735.161 314.753Z" fill="white"/>
            <path d="M911.502 147.974C925.076 206.729 938.501 252.68 940.44 262.321L946.598 303.461C946.511 308.372 946.647 311.997 947.09 315.731C948.261 323.196 948.913 335.453 950.62 356.56C954.365 373.468 954.505 398.335 968.753 407.697C974.096 411.207 981.378 413.866 987.773 410.821C995.035 407.364 993.652 353.109 1036.21 338.429C1052.21 332.912 1076.44 365.042 1114.77 375.934C1120.89 377.673 1126.71 375.978 1125.54 373.461C1115.65 352.356 1045.43 306.198 1058.21 277.469C1064.03 264.382 1081.9 257.053 1095 225.907C1108.94 192.786 1124.06 131.557 1106.11 139.431C1080.08 150.849 1043.72 197.742 1025.21 216.735C1021.9 220.138 1018.33 220.424 1015.12 218.533C1011.9 216.643 1008.75 212.894 1003.26 202.002C977.544 150.969 975.611 123.369 966.299 109.371C962.392 103.498 919.112 73.6119 911.048 95.0133C908.017 103.058 905.478 121.897 911.502 147.974Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M668.442 106.939C677.699 107.958 683.465 117.782 689.717 129.897C697.593 145.159 704.017 173.784 710.319 222.75C727.622 357.217 704.211 407.601 699.656 413.2C678.86 438.752 651.945 316.836 643.451 283.298C638.07 262.048 634.952 239.944 626.17 229.572C613.241 214.304 598.633 279.961 590.063 341.773C582.09 399.285 578.052 441.17 573.345 448.115C570.984 451.6 566.969 452.496 562.972 451.707C554.151 449.964 546.312 440.073 540.007 431.08L532.038 366.758C529.671 340.203 538.672 267.076 550.43 173.427C554.627 139.996 558.051 135.554 564.909 130.188C600.887 102.04 639.382 103.74 668.442 106.939ZM632.266 176.761C646.76 152.632 622.444 158.047 608.475 163.771C606.729 165.361 605.091 167.445 604.077 169.638C603.064 171.832 602.806 174.23 603.35 176.17C604.468 180.153 610.392 181.74 617.551 182.33C623.881 182.851 628.915 179.078 632.266 176.761Z" fill="white"/>
            <path d="M1152.22 186.781C1179.25 171.544 1210.75 165.982 1218.49 165.891C1234.58 159.637 1244.7 162.62 1247.75 164.893C1251.42 167.27 1254.35 170.077 1256.72 173.707C1262.9 183.145 1270.12 191.7 1266.33 201.377C1264.59 205.825 1261.7 212.452 1254.2 217.231C1231.59 231.64 1194 249.744 1185.19 263.327C1184.02 265.131 1183.88 266.895 1184.44 268.852C1185 270.808 1186.11 272.991 1187.74 274.831C1190.98 278.506 1197.35 280.727 1205.02 280.338C1210.1 280.081 1237.52 276.721 1276.44 280.267C1294.99 281.957 1302.56 284.054 1312.2 292.192C1344.74 319.682 1353.41 327.076 1353.87 338.569C1354.27 348.368 1351.9 368.33 1340.86 395.928C1321.11 445.312 1317.26 457.506 1305.17 464.078C1297.64 468.17 1275.31 476.36 1250.07 463.517C1224.12 450.316 1198.72 433.731 1198.38 424.872C1198.09 417.536 1198.47 411.126 1203.57 406.397C1221.49 389.791 1229.33 383.543 1231.19 374.026C1234.1 359.192 1235.26 338.024 1227.85 333.514C1224.38 331.397 1215.57 329.106 1203.44 331.206C1185.72 334.272 1154.57 343.599 1130.63 330.416C1120.09 324.607 1102.05 313.634 1099.15 300.337C1096.09 286.314 1095.69 265.362 1100.25 254.808C1107.11 238.909 1117.53 206.33 1152.22 186.781Z" fill="white"/>
          </svg>
        </div>
      </motion.div>

      {/* Pong game — fills the slide, transparent canvas */}
      <PongGameDesktop />

      {/* ← → hint — fades in after 1.5s, sits above the canvas */}
      <motion.p
        className="absolute bottom-5 left-0 right-0 text-center z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          fontFamily: F.body,
          fontSize: 'clamp(0.5rem, 0.7vw, 0.65rem)',
          color: C.white,
          opacity: 0.22,
          letterSpacing: '0.06em',
        }}
      >
        ← → to play · gets harder over time
      </motion.p>

      {/* Back button — needed since ← arrow key is captured by the game */}
      {onPrev && (
        <motion.button
          className="absolute top-4 left-5 z-30 flex items-center gap-1.5"
          onClick={onPrev}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          whileHover={{ opacity: 0.65 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(0.5rem, 0.7vw, 0.62rem)',
            color: C.white,
            letterSpacing: '0.05em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ← back
        </motion.button>
      )}

      {/* Subtle footer */}
      {slide.footer && (
        <motion.p
          className="absolute bottom-5 right-6 z-30 pointer-events-none"
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(0.5rem, 0.7vw, 0.62rem)',
            color: C.white,
            opacity: 0.18,
            letterSpacing: '0.05em',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {slide.footer}
        </motion.p>
      )}
    </div>
  );
}
