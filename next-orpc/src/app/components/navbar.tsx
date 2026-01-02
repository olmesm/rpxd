"use server"

import Link from "next/link"
import { SignOutButton } from "./sign-out-button"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function Navbar() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	return (
		<nav>
			<ul>
				<li>
					<strong>rpxd</strong>
				</li>
			</ul>
			<ul>
				<li>
					<Link href="#">About</Link>
				</li>
				<li>
					<Link href="#">Services</Link>
				</li>
				<li>
					<Link href="#">Products</Link>
				</li>
			</ul>
			{session?.user ? (
				<ul>
					<li>{session.user.email}</li>
					<li>
						<SignOutButton />
					</li>
				</ul>
			) : (
				<ul>
					<li>
						<Link href="/sign-in">Sign In</Link>
					</li>
					<li>
						<Link href="/sign-up">Sign Up</Link>
					</li>
				</ul>
			)}
		</nav>
	)
}
