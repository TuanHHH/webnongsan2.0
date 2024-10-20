import React, { useCallback, useState } from "react";
import { InputField, Button, ForgotPassword } from "@/components";
import Swal from 'sweetalert2'
import { apiLogin, apiRegister } from "@/apis";
import { useNavigate, Link } from "react-router-dom";
import path from "@/utils/path";
import { login } from '@/store/user/userSlice'
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { ClipLoader } from "react-spinners";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    name: ""
  });

  const [isRegister, setisRegister] = useState(false)
  const [isForgotPass, setIsForgotPass] = useState(false)
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    const { name, ...data } = payload;
    if (isRegister) {
      const res = await apiRegister(payload);
      setLoading(false);
      if (res.statusCode === 201) {
        Swal.fire(
          'Congratulation', "Đăng ký thành công", 'success'
        ).then(() => {
          setisRegister(false)
        })
      }
      else {
        setLoading(false)
        Swal.fire(
          'Oops!', res.message, 'error'
        )
      }

    }
    else {
      const result = await apiLogin(data)
      if (result.statusCode === 200) {
        dispatch(login({ isLoggedIn: true, token: result.data.access_token, userData: result.data.user }));
        setLoading(true);
        setTimeout(() => {
          navigate(`/${path.HOME}`);
        }, 1000)

      }
      else {
        setLoading(false)
        Swal.fire(
          'Oops!', result.message, 'error'
        )
      }

    }
  }, [payload, isRegister, dispatch, navigate]);

  return (
    <div className="w-full h-screen relative">
      {isForgotPass && <ForgotPassword onClose={() => setIsForgotPass(false)} />}
      <img
        src="https://marketplace.canva.com/EAE-oux8hGI/1/0/1600w/canva-green-aesthetic-abstract-shape-desktop-wallpaper-5YYLds0aPrE.jpg"
        className="w-full h-full object-cover"
        alt=""
      />
      <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
        <div className="p-8 bg-white rounded-md min-w-[500px] w-1/2">
          <h1 className="text-[28px] font-semibold text-main text-center mb-8">
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </h1>
          {loading ? (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <ClipLoader size={35} color={"#123abc"} loading={loading} />
            </div>
          ) : (
            <>
              {isRegister && (
                <div className="flex items-start gap-2">
                  <InputField
                    value={payload.name}
                    setValue={setPayload}
                    nameKey="name"
                    register={formRegister}
                    errors={errors}
                    validationRules={{
                      required: 'Tên không được bỏ trống',
                      pattern: {
                        value: /^[a-zA-ZÀ-ỹ\s]+$/,
                        message: 'Tên chỉ được chứa các ký tự chữ cái và khoảng trắng'
                      }
                    }}
                  />
                </div>
              )}
              <InputField
                value={payload.email}
                setValue={setPayload}
                nameKey="email"
                register={formRegister}
                errors={errors}
                validationRules={{
                  required: 'Email không được để trống', pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Vui lòng nhập email hợp lệ'
                  }
                }}
              />
              <InputField
                type="password"
                value={payload.password}
                setValue={setPayload}
                nameKey="password"
                register={formRegister}
                errors={errors}
                validationRules={{
                  required: 'Vui lòng nhập mật khẩu',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  },
                  maxLength: {
                    value: 50,
                    message: 'Mật khẩu tối đa 50 ký tự'
                  }
                }}
              />
              <Button
                fw={true}
                handleOnClick={handleSubmit(onSubmit)}
              >
                {isRegister ? "Đăng ký" : "Đăng nhập"}
              </Button>
            </>
          )}

          <div className="flex items-center justify-between my-2">
            {!isRegister && (
              <>
                <span className="text-gray-700 hover:text-blue-700 hover:underline cursor-pointer" onClick={() => setIsForgotPass(true)}>
                  Quên mật khẩu?
                </span>

                <span
                  className="text-gray-700 hover:text-blue-700 hover:underline cursor-pointer"
                  onClick={() => setisRegister(true)}
                >
                  Tạo tài khoản
                </span>
              </>
            )}
            {isRegister && (
              <span
                className="w-full text-center text-gray-700 hover:text-blue-700 hover:underline cursor-pointer"
                onClick={() => setisRegister(false)}
              >
                Đăng nhập
              </span>
            )}

          </div>
          <div className="flex justify-center">
            <Link className="text-gray-700 hover:underline cursor-pointer text-center"
              to={`/${path.HOME}`}
            > Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;

