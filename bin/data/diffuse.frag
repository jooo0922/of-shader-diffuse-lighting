#version 410

// c++ 미리 계산된 후 받아온 조명연산에 필요한 유니폼 변수들
uniform vec3 lightDir; // 뒤집어지고 정규화된 조명벡터
uniform vec3 lightCol; // 조명색상 (조명강도가 곱해짐)
uniform vec3 meshCol; // torus 의 원 색상

in vec3 fragNrm; // 버텍스 셰이더에서 받아온 torus 모델의 노멀벡터가 보간되어 들어온 값.

out vec4 outCol; // 최종 출력할 색상을 계산하여 다음 파이프라인으로 넘겨줄 변수

void main(){
  // 프래그먼트 셰이더에서 보간된 노멀벡터는 길이가 1로 보존되지 않을 확률이 높아서, 노말연산을 하기 전 다시 정규화해줘야 함.
  vec3 normal = normalize(fragNrm);

  float lightAmt = dot(normal, lightDir); // 정규화된 노말벡터와 조명벡터를 내적연산함 -> 내적값은 '조명이 들어오는 양' 정도로 생각하면 됨.
  lightAmt = max(0.0, lightAmt); // 내적의 결과값은 -1 ~ 1 사이의 값이고, 조명값이 음수면 다른 라이트 및 색상과 더해줄 때 문제가 되므로 max() 내장함수로 모든 음수값을 0으로 초기화함.
  vec3 fragLight = lightCol * lightAmt; // 0 ~ 1 사이로 매핑된 내적값(조명의 양)과 조명색상을 곱해서 실제 조명값을 계산해줌.

  outCol = vec4(meshCol * fragLight, 1.0); // 조명값과 물체의 원 색상을 곱해줘서 프래그먼트의 최종 색상을 결정함.
}