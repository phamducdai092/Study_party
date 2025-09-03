import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { BookOpen, Users, Video, GraduationCap } from 'lucide-react';

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	async function onSubmit() {
		if (!email || !password || !confirmPassword) {
			setError('Vui lòng nhập đầy đủ thông tin');
			return;
		}

		if (password !== confirmPassword) {
			setError('Mật khẩu xác nhận không khớp');
			return;
		}

		setLoading(true);
		setError('');

		try {
			// await login({ email, password });
			// Simulate redirect
			console.log('Login successful!');
		} catch (err) {
			setError('Email hoặc mật khẩu không chính xác');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Login Card */}
				<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader className="text-center pb-4">
						<CardTitle className="text-3xl font-semibold text-gray-800">
							<div className="flex justify-center items-center gap-2 mb-4">
								<div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
									<GraduationCap className="w-8 h-8 text-white" />
								</div>
								<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-2">
									Đăng ký
								</h1>
							</div>
						</CardTitle>
						<CardDescription className="text-base text-gray-600">
							Tham gia vào các nhóm học online của bạn
						</CardDescription>
					</CardHeader>

					<CardContent>
						<div className="space-y-6">
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-lg font-medium text-gray-700"
								>
									Email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="example@student.edu.vn"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-lg font-medium text-gray-700"
								>
									Mật khẩu
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="confirmPassword"
									className="text-lg font-medium text-gray-700"
								>
									Xác nhận mật khẩu
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>

							{error && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-600">
										{error}
									</p>
								</div>
							)}

							<Button
								onClick={onSubmit}
								className="cursor-pointer text-lg w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
								disabled={loading}
							>
								{loading ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										Đang đăng ký...
									</div>
								) : (
									'Đăng ký'
								)}
							</Button>
						</div>
					</CardContent>

					<CardFooter className="pt-6">
						<div className="w-full text-center space-y-4">
							<div className="flex items-center justify-end text-base">
								<a
									href="/login"
									className="text-blue-600 hover:text-blue-800 hover:underline"
								>
									Đăng nhập
								</a>
							</div>
							<div className="pt-4 border-t border-gray-100">
								<p className="text-base text-gray-500 mb-3">
									Tính năng nổi bật:
								</p>
								<div className="flex justify-center gap-6 text-base text-gray-600">
									<div className="flex items-center gap-1">
										<Users className="w-3 h-3 text-blue-500" />
										<span>Nhóm học</span>
									</div>
									<div className="flex items-center gap-1">
										<Video className="w-3 h-3 text-green-500" />
										<span>Video call</span>
									</div>
									<div className="flex items-center gap-1">
										<BookOpen className="w-3 h-3 text-purple-500" />
										<span>Tài liệu</span>
									</div>
								</div>
							</div>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
