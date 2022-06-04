#version 410

// layout 을 이용해서 버텍스 셰이더에서 각 버텍스 데이터가 저장된 순서를 알려줌. (오픈프레임웍스가 버텍스 데이터를 저장하는 순서는 p.74 참고)
layout(location = 0) in vec3 pos;
layout(location = 2) in vec3 nrm; // 이번에는 torus 모델의 노멀벡터 데이터를 가져온 뒤, 프래그먼트 셰이더로 보내 보간하여 색상으로 찍어줄거임.

uniform mat4 mvp; // c++ (오픈프레임웍스)에서 합쳐준 투영 * 뷰 * 모델 행렬을 전달받는 유니폼 변수
uniform mat3 normalMatrix; // 조명계산에 필요한 노멀벡터(즉, 월드공간으로 변환된 노멀벡터)를 계산하려면, 노말행렬을 따로 구해서 버텍스 셰이더에 가져옴.

out vec3 fragNrm; // 프래그먼트 셰이더로 전송할 torus 모델의 노멀벡터

void main() {
  gl_Position = mvp * vec4(pos, 1.0);
  fragNrm = (normalMatrix * nrm).xyz; // 노말행렬과 오브젝트공간 기준의 노말벡터를 구해서 월드공간으로 변환된 노말벡터를 구함.
}