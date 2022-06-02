#pragma once

#include "ofMain.h"

// 카메라의 현재 위치 및 fov(시야각)값을 받는 구조체 타입 지정. (구조체 타입은 ts interface 랑 비슷한 개념이라고 생각하면 될 것 같음.)
struct CameraData {
    glm::vec3 pos;
    float fov;
};

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void mouseEntered(int x, int y);
		void mouseExited(int x, int y);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);
		
    ofMesh torusMesh; // torus.ply 모델링 파일을 로드해서 사용할 메쉬 객체 변수 선언
    ofShader normalShader; // torus.ply 모델의 버텍스 노멀벡터를 보간하여 색상 데이터로 사용할 셰이더 객체 변수 선언
    CameraData cam;
};
