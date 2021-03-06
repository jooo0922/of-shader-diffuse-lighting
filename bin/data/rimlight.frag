#version 410

// c++ 미리 계산된 후 받아온 조명연산에 필요한 유니폼 변수들
uniform vec3 lightDir; // 뒤집어지고 정규화된 조명벡터
uniform vec3 lightCol; // 조명색상 (조명강도가 곱해짐)
uniform vec3 meshCol; // torus 의 원 색상

uniform vec3 cameraPos; // 각 프래그먼트에서 카메라로 향하는 뷰벡터를 구하기 위해 필요한 카메라 위치값. (정확히는 카메라의 월드좌표)

in vec3 fragNrm; // 버텍스 셰이더에서 받아온 torus 모델의 노멀벡터가 보간되어 들어온 값.
in vec3 fragWorldPos; // 버텍스 셰이더에서 구한 각 버텍스의 월드좌표가 보간되어 들어온 값. -> 죽, 각 프래그먼트의 월드좌표! 

out vec4 outCol; // 최종 출력할 색상을 계산하여 다음 파이프라인으로 넘겨줄 변수

void main(){
  // 프래그먼트 셰이더에서 보간된 노멀벡터는 길이가 1로 보존되지 않을 확률이 높아서, 노말연산을 하기 전 다시 정규화해줘야 함.
  vec3 normal = normalize(fragNrm);

  // 각 프래그먼트 월드좌표 -> 카메라 월드좌표 까지의 벡터를 구한 뒤, 길이를 1로 정규화함. (즉, 유니티에서 사용하는 뷰 벡터를 구한 것임!)
  vec3 toCam = normalize(cameraPos - fragWorldPos);

  /*
    유니티에서 했던 것처럼, 프레넬 값을 구하는 과정임.
    
    1. 각 프래그먼트의 노말벡터와 각 프래그먼트에서 카메라까지의 뷰 벡터를 내적계산함.
    2. 내적값이 -1 ~ 1 범위에 있는데, 음수값이 나오면 다른 조명이나 색상값과 더할 때 문제가 생기므로, max() 함수로 음수값을 0으로 초기화함.
    3. 여기까지 계산된 내적값은 카메라와 마주보는 곳일수록 1에 가까워서 오히려 밝아지고, 가장자리가 0에 가까워서 어둡게 렌더링됨.
    하지만, 우리가 원하는 림라이트 효과는 그것의 반대니까, 1에서 빼줘서 값을 뒤집은 것.
  */
  float rimAmt = 1.0 - max(0.0, dot(normal, toCam)); 
  rimAmt = pow(rimAmt, 2); // 유니티에서 했던 것처럼, 프레넬의 흰색 두께를 좁히기 위해 프레넬 값을 거듭제곱함. 자세한 내용은 유니티 셰이더 p.330 참고!

  float lightAmt = dot(normal, lightDir); // 정규화된 노말벡터와 조명벡터를 내적연산함 -> 내적값은 '조명이 들어오는 양' 정도로 생각하면 됨.
  lightAmt = max(0.0, lightAmt); // 내적의 결과값은 -1 ~ 1 사이의 값이고, 조명값이 음수면 다른 라이트 및 색상과 더해줄 때 문제가 되므로 max() 내장함수로 모든 음수값을 0으로 초기화함.
  vec3 fragLight = lightCol * lightAmt; // 0 ~ 1 사이로 매핑된 내적값(조명의 양)과 조명색상을 곱해서 실제 조명값을 계산해줌.

  // 물체의 원 색상과 조명값을 곱해 최종 색상값을 구한 뒤,
  // 위에서 구한 프레넬 값을 더해줌. -> 즉, 메쉬의 기존 조명값 위에, 림라이트 효과, 즉 프레넬 값을 얹어주는 개념으로 보면 됨.
  // 그래서, 다른 라이팅을 전부 구하고 난 뒤, 마지막에 프레넬 값을 얹어준다는 느낌으로 값을 더함.
  outCol = vec4(meshCol * fragLight + rimAmt, 1.0);
}