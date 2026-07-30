package usecase


type RegisterRequest struct {
	Email string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}
type LoginRequest struct {
	Email string `json:"email"`
	Password string `json:"password"`
}
type LoginResponse struct {
	AccessToken string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	Role string `json:"role"`
}
type UpdateEmailRequest struct {
	ID uint `json:"id"`
	NewEmail string `json:"new_email"`
}
type UpdateUsernameRequest struct {
	ID uint `json:"id"`
	NewUsername string `json:"new_username"`
}
type UpdatePasswordRequest struct {
	ID uint `json:"id"`
	NewPassword string `json:"new_password"`
}
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token"`
}