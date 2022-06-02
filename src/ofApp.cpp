#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofDisableArbTex(); // 스크린 픽셀 좌표를 사용하는 텍스쳐 관련 오픈프레임웍스 레거시 지원 설정 비활성화. (uv좌표계랑 다르니까!)
    ofEnableDepthTest(); // 깊이테스트를 활성화하여 z좌표값을 깊이버퍼에 저장해서 z값을 기반으로 앞뒤를 구분하여 렌더링할 수 있도록 함.
    
    torusMesh.load("torus.ply"); // torus 메쉬로 사용할 모델링 파일 로드
    normalShader.load("mesh.vert", "normal_vis.frag"); // torus 메쉬에 사용할 셰이더 파일 로드
}

//--------------------------------------------------------------
void ofApp::update(){

}

//--------------------------------------------------------------
void ofApp::draw(){
    using namespace glm; // 이제부터 현재 블록 내에서 glm 라이브러리에서 꺼내 쓸 함수 및 객체들은 'glm::' 을 생략해서 사용해도 됨.
    
    cam.pos = vec3(0, 0, 1); // 카메라 위치는 z축으로 1만큼 안쪽으로 들어가게 함.
    cam.fov = radians(100.0f); // 원근 프러스텀의 시야각은 일반 PC 게임에서는 90도 전후의 값을 사용함. -> 라디안 각도로 변환하는 glm 내장함수 radians() 를 사용함.
    float aspect = 1024.0f / 768.0f; // main.cpp 에서 정의한 윈도우 실행창 사이즈를 기준으로 종횡비(aspect)값을 계산함.
    
    // 모델행렬은 회전행렬 및 크기행렬만 적용.
    // 크기 * 회전 * 이동 순 곱셈을 열 우선 행렬에서는 역순으로 곱하여 이동 * 회전 * 크기 순으로 곱함. 이때, 이동변환은 없으므로, 회전 * 크기 순으로 곱함.
    mat4 model = rotate(1.0f, vec3(1, 1, 1)) * scale(vec3(0.5, 0.5, 0.5));
    
    // 카메라 이동변환시키는 뷰행렬 계산. -> 뷰행렬은 카메라 움직임에 반대방향으로 나머지 대상들을 움직이는 변환행렬이므로, 반드시 glm::inverse() 내장함수로 역행렬을 구해야 함.
    mat4 view = inverse(translate(cam.pos));
    
    // glm::perspective() 내장함수를 사용해 원근투영행렬 계산.
    mat4 proj = perspective(cam.fov, aspect, 0.01f, 10.0f);
    
    // 최적화를 위해 c++ 단에서 투영 * 뷰 * 모델행렬을 한꺼번에 곱해서 버텍스 셰이더에 전송함.
    mat4 mvp = proj * view * model; // 열 우선 행렬이라 원래의 곱셈 순서인 '모델 -> 뷰 -> 투영'의 반대 순서로 곱해줘야 함.
    
    // normalShader 를 바인딩하여 사용 시작
    normalShader.begin();
    
    normalShader.setUniformMatrix4f("mvp", mvp); // 위에서 한꺼번에 합쳐준 mvp 행렬을 버텍스 셰이더 유니폼 변수로 전송
    torusMesh.draw(); // torus 메쉬 드로우콜 호출하여 그려줌.
    
    normalShader.end();
    // normalShader 사용 중단
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
