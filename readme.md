
진짜 유튜브 웹 서비스를 운영해보자


<회원 API 설계>

회원
 1) 로그인 : POST /login
    - req : body (email, password)
    - res 200 : 로그인 여부 // => 메인 페이지로

 2) 회원 가입 : POST /join
    - req : body (email, name, password, contact)
    - res 201 : 회원가입 결과 // => 로그인 페이지로
 
 3) 회원 개별 조회 : GET /users
    - req : body (email)
    - res 200 : 조회 결과
 
 4) 회원 개별 탈퇴 : DELETE /users
    - req : body (email)
    - res 200 : 탈퇴 결과 // => 메인 페이지로

** 회원은 계정 1개당 최대 채널 100개 **
===================================================================

채널
 1) 채널 생성 : POST /channels
   - req : body (userId, name)
   - res 201 : 채널 생성 결과 // => 채널 관리 페이지로

 2) 채널 개별 수정 : PUT /channels/:id
   - req : URL (id), body (name)
   - res 200 : 채널 수정 결과

 3) 채널 개별 삭제 : DELETE /channels/:id
   - req : URL (id)
   - res 200 : 채널 삭제 결과 // => 메인 페이지로

 4) 특정 회원의 채널 전체 조회 : GET /channels
   - req : body (userId)
   - res 200 : 회원의 전체 채널 조회 결과

 5) 채널 개별 조회 : GET /channels/:id
   - req : URL (id) 
   - res 200 : 개별 채널 조회 결과
