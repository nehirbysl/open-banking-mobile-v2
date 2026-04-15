/**
 * ProductArtwork — SVG illustrations for every product kind.
 *
 * Uses react-native-svg so artwork scales crisply on every device.
 * One component, all shapes — keyed by the product's `kind` field.
 */

import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type { ProductKind } from '../utils/products';

interface Props {
  kind: ProductKind;
  size?: number;
}

export default function ProductArtwork({ kind, size = 140 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {renderArt(kind)}
    </Svg>
  );
}

function renderArt(kind: ProductKind) {
  switch (kind) {
    case 'frankincense':
      return <Frankincense />;
    case 'khanjar':
      return <Khanjar />;
    case 'coffee':
      return <CoffeeDallah />;
    case 'honey':
      return <HoneyJar />;
    case 'dates':
      return <DatesBox />;
    case 'bukhoor':
      return <Bukhoor />;
    case 'silver':
      return <SilverNecklace />;
    case 'textile':
      return <PashminaShawl />;
    case 'pottery':
      return <ClayJar />;
    case 'rosewater':
      return <RosewaterBottle />;
    case 'myrrh':
      return <MyrrhTears />;
    case 'amouage':
      return <AttarVials />;
    default:
      return null;
  }
}

function Frankincense() {
  return (
    <G>
      <Defs>
        <LinearGradient id="fg1" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#B8860B" />
          <Stop offset="1" stopColor="#DAA520" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="160" rx="50" ry="12" fill="#8B6914" opacity="0.3" />
      <Path
        d="M65 155 Q65 130 70 120 L130 120 Q135 130 135 155 Z"
        fill="url(#fg1)"
        stroke="#8B6914"
        strokeWidth="1.5"
      />
      <Ellipse cx="100" cy="120" rx="30" ry="8" fill="#DAA520" stroke="#8B6914" />
      <Rect x="88" y="145" width="24" height="12" rx="3" fill="#8B6914" opacity="0.4" />
      <Path
        d="M75 120 Q75 100 100 90 Q125 100 125 120"
        fill="url(#fg1)"
        stroke="#8B6914"
        strokeWidth="1.5"
      />
      <Circle cx="95" cy="107" r="2" fill="#8B6914" opacity="0.5" />
      <Circle cx="105" cy="105" r="2" fill="#8B6914" opacity="0.5" />
      <Circle cx="100" cy="112" r="2" fill="#8B6914" opacity="0.5" />
      <Path
        d="M100 90 Q95 75 100 60 Q105 45 98 30"
        fill="none"
        stroke="#DAA520"
        strokeWidth="2"
        opacity="0.5"
        strokeLinecap="round"
      />
      <Path
        d="M105 88 Q112 70 108 55 Q104 40 110 25"
        fill="none"
        stroke="#E8C547"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      <Path
        d="M94 89 Q88 72 92 58 Q96 44 90 32"
        fill="none"
        stroke="#C9A83A"
        strokeWidth="1.5"
        opacity="0.35"
        strokeLinecap="round"
      />
    </G>
  );
}

function Khanjar() {
  return (
    <G>
      <Defs>
        <LinearGradient id="kg1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#C0C0C0" />
          <Stop offset="0.5" stopColor="#E8E8E8" />
          <Stop offset="1" stopColor="#A0A0A0" />
        </LinearGradient>
        <LinearGradient id="kg2" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#8B6914" />
          <Stop offset="1" stopColor="#DAA520" />
        </LinearGradient>
      </Defs>
      <Path
        d="M85 70 Q83 90 78 120 Q72 150 90 170"
        fill="none"
        stroke="url(#kg2)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <Path
        d="M105 55 Q115 80 120 110 Q125 140 115 165"
        fill="url(#kg1)"
        stroke="#808080"
      />
      <Rect x="96" y="38" width="18" height="22" rx="4" fill="url(#kg2)" stroke="#8B6914" />
      <Circle cx="105" cy="49" r="3" fill="#DAA520" stroke="#8B6914" strokeWidth="0.5" />
      <Line x1="99" y1="43" x2="111" y2="43" stroke="#DAA520" />
      <Line x1="99" y1="55" x2="111" y2="55" stroke="#DAA520" />
      <Path d="M100 38 Q105 30 110 38" fill="url(#kg2)" stroke="#8B6914" />
      <Ellipse cx="105" cy="60" rx="14" ry="4" fill="#A0A0A0" stroke="#808080" />
    </G>
  );
}

function CoffeeDallah() {
  return (
    <G>
      <Defs>
        <LinearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#CD7F32" />
          <Stop offset="0.5" stopColor="#D4943A" />
          <Stop offset="1" stopColor="#B87333" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="170" rx="45" ry="10" fill="#B87333" opacity="0.2" />
      <Path
        d="M75 90 Q70 120 72 145 Q74 160 100 165 Q126 160 128 145 Q130 120 125 90 Z"
        fill="url(#cg1)"
        stroke="#8B6508"
        strokeWidth="1.5"
      />
      <Path
        d="M88 90 Q88 75 90 65 L110 65 Q112 75 112 90"
        fill="url(#cg1)"
        stroke="#8B6508"
      />
      <Ellipse cx="100" cy="65" rx="12" ry="4" fill="#D4943A" stroke="#8B6508" />
      <Line x1="100" y1="65" x2="100" y2="50" stroke="#8B6508" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="100" cy="47" r="4" fill="#D4943A" stroke="#8B6508" />
      <Path
        d="M125 95 Q140 85 145 75 Q148 68 145 65"
        fill="none"
        stroke="#8B6508"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M88 80 Q60 90 58 120 Q56 140 72 150"
        fill="none"
        stroke="#8B6508"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path d="M76 110 Q100 115 124 110" fill="none" stroke="#DAA520" strokeWidth="1.5" />
      <Path d="M74 130 Q100 135 126 130" fill="none" stroke="#DAA520" strokeWidth="1.5" />
    </G>
  );
}

function HoneyJar() {
  return (
    <G>
      <Defs>
        <LinearGradient id="hg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F0C040" />
          <Stop offset="1" stopColor="#D4940A" />
        </LinearGradient>
        <LinearGradient id="hg2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E8D5B0" />
          <Stop offset="1" stopColor="#C8B090" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="172" rx="38" ry="8" fill="#D4940A" opacity="0.2" />
      <Path
        d="M68 80 Q65 100 65 130 Q65 165 100 168 Q135 165 135 130 Q135 100 132 80 Z"
        fill="url(#hg1)"
        stroke="#B8860B"
        strokeWidth="1.5"
      />
      <Path
        d="M72 100 Q100 105 128 100 Q130 130 100 135 Q70 130 72 100 Z"
        fill="#E8B828"
        opacity="0.4"
      />
      <Rect x="78" y="68" width="44" height="15" rx="3" fill="url(#hg2)" stroke="#B8860B" />
      <Ellipse cx="100" cy="65" rx="28" ry="8" fill="url(#hg2)" stroke="#B8860B" />
      <Path d="M76 72 Q100 78 124 72" fill="none" stroke="#8B6508" strokeWidth="1.5" />
      <Rect
        x="82"
        y="115"
        width="36"
        height="28"
        rx="4"
        fill="#FFF8E0"
        stroke="#B8860B"
        strokeWidth="0.8"
        opacity="0.85"
      />
      <SvgText
        x="100"
        y="133"
        fontFamily="serif"
        fontSize="8"
        fill="#8B6508"
        textAnchor="middle"
        fontWeight="bold"
      >
        SIDR
      </SvgText>
    </G>
  );
}

function DatesBox() {
  return (
    <G>
      <Defs>
        <LinearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#DAA520" />
          <Stop offset="1" stopColor="#B8860B" />
        </LinearGradient>
        <LinearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8B4513" />
          <Stop offset="1" stopColor="#5C3010" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="168" rx="48" ry="10" fill="#8B6914" opacity="0.2" />
      <Path
        d="M55 75 L55 155 Q55 162 62 162 L138 162 Q145 162 145 155 L145 75 Z"
        fill="url(#dg1)"
        stroke="#8B6508"
        strokeWidth="1.5"
      />
      <Path
        d="M55 75 L55 58 Q55 52 62 52 L138 52 Q145 52 145 58 L145 75 Z"
        fill="#E8C547"
        stroke="#8B6508"
        strokeWidth="1.5"
      />
      <Line x1="85" y1="80" x2="85" y2="158" stroke="#8B6508" strokeWidth="0.8" opacity="0.5" />
      <Line x1="115" y1="80" x2="115" y2="158" stroke="#8B6508" strokeWidth="0.8" opacity="0.5" />
      <Line x1="58" y1="118" x2="142" y2="118" stroke="#8B6508" strokeWidth="0.8" opacity="0.5" />
      <Ellipse cx="70" cy="98" rx="10" ry="7" fill="url(#dg2)" />
      <Ellipse cx="100" cy="96" rx="10" ry="7" fill="url(#dg2)" />
      <Ellipse cx="130" cy="98" rx="10" ry="7" fill="#6B3410" />
      <Ellipse cx="70" cy="138" rx="10" ry="7" fill="#6B3410" />
      <Ellipse cx="100" cy="136" rx="10" ry="7" fill="url(#dg2)" />
      <Ellipse cx="130" cy="138" rx="10" ry="7" fill="url(#dg2)" />
    </G>
  );
}

function Bukhoor() {
  return (
    <G>
      <Defs>
        <LinearGradient id="bg1" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#8B0000" />
          <Stop offset="0.5" stopColor="#A52A2A" />
          <Stop offset="1" stopColor="#CD5C5C" />
        </LinearGradient>
        <LinearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#DAA520" />
          <Stop offset="1" stopColor="#B8860B" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="172" rx="40" ry="10" fill="#8B0000" opacity="0.2" />
      <Path
        d="M78 165 L72 155 Q70 152 74 150 L126 150 Q130 152 128 155 L122 165 Z"
        fill="url(#bg2)"
        stroke="#8B6508"
      />
      <Rect x="94" y="130" width="12" height="22" rx="2" fill="url(#bg2)" stroke="#8B6508" />
      <Path
        d="M68 130 Q65 110 70 95 Q80 80 100 78 Q120 80 130 95 Q135 110 132 130 Z"
        fill="url(#bg1)"
        stroke="#7A0000"
        strokeWidth="1.5"
      />
      <Ellipse cx="100" cy="130" rx="32" ry="8" fill="#CD5C5C" stroke="#7A0000" />
      <Path d="M75 105 Q100 100 125 105" fill="none" stroke="#DAA520" strokeWidth="1.5" />
      <Circle cx="88" cy="95" r="2.5" fill="#DAA520" opacity="0.7" />
      <Circle cx="100" cy="92" r="2.5" fill="#DAA520" opacity="0.7" />
      <Circle cx="112" cy="95" r="2.5" fill="#DAA520" opacity="0.7" />
      <Path
        d="M95 78 Q90 60 95 42 Q100 28 93 18"
        fill="none"
        stroke="#CD5C5C"
        strokeWidth="2"
        opacity="0.35"
        strokeLinecap="round"
      />
      <Path
        d="M105 76 Q112 55 107 38 Q102 24 108 12"
        fill="none"
        stroke="#A52A2A"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />
    </G>
  );
}

function SilverNecklace() {
  return (
    <G>
      <Defs>
        <LinearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E8E8E8" />
          <Stop offset="1" stopColor="#A8A8A8" />
        </LinearGradient>
      </Defs>
      <Path
        d="M40 60 Q100 110 160 60"
        fill="none"
        stroke="url(#sg1)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="60" cy="80" r="6" fill="url(#sg1)" stroke="#808080" />
      <Circle cx="80" cy="95" r="6" fill="url(#sg1)" stroke="#808080" />
      <Circle cx="120" cy="95" r="6" fill="url(#sg1)" stroke="#808080" />
      <Circle cx="140" cy="80" r="6" fill="url(#sg1)" stroke="#808080" />
      <Path
        d="M85 100 L100 160 L115 100 Z"
        fill="url(#sg1)"
        stroke="#606060"
        strokeWidth="1.5"
      />
      <Circle cx="100" cy="120" r="8" fill="#B22222" opacity="0.7" />
      <Circle cx="95" cy="135" r="4" fill="#B22222" opacity="0.7" />
      <Circle cx="105" cy="135" r="4" fill="#B22222" opacity="0.7" />
      <Circle cx="100" cy="148" r="5" fill="url(#sg1)" stroke="#606060" />
    </G>
  );
}

function PashminaShawl() {
  return (
    <G>
      <Defs>
        <LinearGradient id="tg1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E8C547" />
          <Stop offset="1" stopColor="#B8860B" />
        </LinearGradient>
      </Defs>
      <Path
        d="M40 60 L160 60 L145 160 L55 160 Z"
        fill="url(#tg1)"
        stroke="#8B6508"
        strokeWidth="1.5"
      />
      <Path d="M45 70 L155 70" stroke="#8B0000" strokeWidth="1.5" opacity="0.6" />
      <Path d="M45 150 L155 150" stroke="#8B0000" strokeWidth="1.5" opacity="0.6" />
      <G opacity="0.6">
        <Path d="M60 80 L60 140" stroke="#8B0000" strokeWidth="0.8" />
        <Path d="M80 80 L80 140" stroke="#8B0000" strokeWidth="0.8" />
        <Path d="M100 80 L100 140" stroke="#8B0000" strokeWidth="0.8" />
        <Path d="M120 80 L120 140" stroke="#8B0000" strokeWidth="0.8" />
        <Path d="M140 80 L140 140" stroke="#8B0000" strokeWidth="0.8" />
      </G>
      <Circle cx="70" cy="110" r="5" fill="none" stroke="#8B0000" strokeWidth="1.2" />
      <Circle cx="100" cy="110" r="5" fill="none" stroke="#8B0000" strokeWidth="1.2" />
      <Circle cx="130" cy="110" r="5" fill="none" stroke="#8B0000" strokeWidth="1.2" />
      <Path d="M55 158 L50 170 M75 158 L72 172 M100 158 L100 174 M125 158 L128 172 M145 158 L150 170" stroke="#8B6508" strokeWidth="1" />
    </G>
  );
}

function ClayJar() {
  return (
    <G>
      <Defs>
        <LinearGradient id="pg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C68B5C" />
          <Stop offset="1" stopColor="#8B5A2B" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="172" rx="42" ry="9" fill="#5C3010" opacity="0.25" />
      <Path
        d="M70 75 Q60 110 65 145 Q72 170 100 170 Q128 170 135 145 Q140 110 130 75 Z"
        fill="url(#pg1)"
        stroke="#5C3010"
        strokeWidth="1.5"
      />
      <Ellipse cx="100" cy="72" rx="32" ry="8" fill="#A0622A" stroke="#5C3010" strokeWidth="1.5" />
      <Ellipse cx="100" cy="68" rx="20" ry="4" fill="#8B5A2B" stroke="#5C3010" />
      <Rect x="95" y="50" width="10" height="18" rx="2" fill="#6B3410" stroke="#5C3010" />
      <Path d="M70 100 Q100 108 130 100" fill="none" stroke="#5C3010" strokeWidth="1" opacity="0.6" />
      <Path d="M68 130 Q100 138 132 130" fill="none" stroke="#5C3010" strokeWidth="1" opacity="0.6" />
      <Path d="M68 155 Q100 160 132 155" fill="none" stroke="#5C3010" strokeWidth="1" opacity="0.6" />
    </G>
  );
}

function RosewaterBottle() {
  return (
    <G>
      <Defs>
        <LinearGradient id="rg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE4E1" />
          <Stop offset="1" stopColor="#F4C2C2" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="175" rx="30" ry="6" fill="#C27B7B" opacity="0.2" />
      <Path
        d="M82 100 Q78 130 78 160 Q78 170 100 170 Q122 170 122 160 Q122 130 118 100 Z"
        fill="url(#rg1)"
        stroke="#C27B7B"
        strokeWidth="1.5"
      />
      <Rect x="88" y="75" width="24" height="25" fill="url(#rg1)" stroke="#C27B7B" strokeWidth="1.5" />
      <Rect x="85" y="68" width="30" height="10" rx="2" fill="#8B0000" stroke="#5C0000" />
      <Rect
        x="82"
        y="120"
        width="36"
        height="30"
        rx="2"
        fill="#FFF5F5"
        stroke="#C27B7B"
        opacity="0.9"
      />
      <SvgText
        x="100"
        y="135"
        fontFamily="serif"
        fontSize="7"
        fill="#8B0000"
        textAnchor="middle"
        fontWeight="bold"
      >
        JEBEL
      </SvgText>
      <SvgText
        x="100"
        y="145"
        fontFamily="serif"
        fontSize="7"
        fill="#8B0000"
        textAnchor="middle"
        fontWeight="bold"
      >
        AKHDAR
      </SvgText>
      <G>
        <Circle cx="70" cy="60" r="4" fill="#D45D5D" />
        <Circle cx="135" cy="55" r="3" fill="#D45D5D" />
        <Circle cx="50" cy="95" r="3" fill="#D45D5D" />
      </G>
    </G>
  );
}

function MyrrhTears() {
  return (
    <G>
      <Defs>
        <LinearGradient id="mg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8B4513" />
          <Stop offset="1" stopColor="#5C2E0A" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="172" rx="50" ry="10" fill="#5C2E0A" opacity="0.2" />
      <Path
        d="M50 120 Q50 160 100 165 Q150 160 150 120 Q150 115 145 115 L55 115 Q50 115 50 120 Z"
        fill="#D2B48C"
        stroke="#8B6508"
        strokeWidth="1.5"
      />
      <Ellipse cx="100" cy="118" rx="50" ry="10" fill="#E8D5B0" stroke="#8B6508" />
      <Ellipse cx="75" cy="135" rx="8" ry="10" fill="url(#mg1)" />
      <Ellipse cx="95" cy="130" rx="9" ry="11" fill="url(#mg1)" />
      <Ellipse cx="115" cy="138" rx="7" ry="9" fill="#6B3410" />
      <Ellipse cx="130" cy="132" rx="8" ry="10" fill="url(#mg1)" />
      <Ellipse cx="85" cy="150" rx="7" ry="8" fill="#6B3410" />
      <Ellipse cx="110" cy="152" rx="8" ry="9" fill="url(#mg1)" />
      <Ellipse cx="125" cy="152" rx="6" ry="7" fill="#6B3410" />
      <Ellipse cx="73" cy="133" rx="3" ry="2" fill="#C8925A" opacity="0.5" />
      <Ellipse cx="93" cy="127" rx="3" ry="2" fill="#C8925A" opacity="0.5" />
    </G>
  );
}

function AttarVials() {
  return (
    <G>
      <Defs>
        <LinearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4B0082" />
          <Stop offset="1" stopColor="#2E004F" />
        </LinearGradient>
      </Defs>
      <Rect
        x="30"
        y="120"
        width="140"
        height="50"
        rx="6"
        fill="url(#ag1)"
        stroke="#1A0033"
        strokeWidth="1.5"
      />
      <Rect x="30" y="120" width="140" height="6" fill="#6A1BB5" opacity="0.6" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 50 + i * 25;
        const fills = ['#4B2E83', '#C49A4B', '#E8E8E8', '#E8B828', '#F4C2C2'];
        return (
          <G key={i}>
            <Rect x={x - 6} y={60} width={12} height={60} rx={2} fill="#F0F0F0" stroke="#A0A0A0" />
            <Rect x={x - 6} y={75} width={12} height={45} fill={fills[i]} opacity={0.85} />
            <Rect x={x - 4} y={50} width={8} height={12} fill="#B8860B" stroke="#8B6508" />
            <Circle cx={x} cy={48} r={3} fill="#DAA520" stroke="#8B6508" />
          </G>
        );
      })}
      <Path d="M35 165 L165 165" stroke="#DAA520" strokeWidth="0.8" opacity="0.6" />
    </G>
  );
}
