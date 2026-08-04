"use client";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import type { ReactNode } from "react";
import { FacebookIcon } from "@/components/facebook-icon";
import { InstagramIcon } from "@/components/instagram-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { YoutubeIcon } from "@/components/youtube-icon";
import { Button } from "@/components/ui/button";
import AppLogo from "./app-logo";
import WhatsAppIcon from "./whatsapp-icon";

type FooterLink = {
	title: string;
	href: string;
	icon?: ReactNode;
};
type FooterLinkGroup = {
	label: string;
	links: FooterLink[];
};

export function StickyFooter() {
	return (
		<footer
			className="relative h-(--footer-height) w-full border-t [--footer-height:320px]"
			style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
		>
			<div className="fixed bottom-0 h-(--footer-height) w-full">
				<div className="sticky top-[calc(100vh-var(--footer-height))] h-full overflow-y-auto">
					<div
						aria-hidden
						className="absolute inset-0 isolate z-0 opacity-50 contain-strict dark:opacity-60"
					>
						<div className="absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
						<div className="absolute top-0 left-0 h-320 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
						<div className="absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
					</div>
					<div className="relative mx-auto flex size-full max-w-7xl flex-col justify-between gap-5">
						<div className="grid grid-cols-1 gap-8 px-4 pt-12 md:grid-cols-2 lg:grid-cols-4">
							<AnimatedContainer className="w-full space-y-6">
								<div className="space-y-1">
									<p className="text-3xl font-semibold font-heading">
										Perfu.me
									</p>
									<p className="text-muted-foreground text-lg">
										Smell good, feel confident.
									</p>
								</div>
							</AnimatedContainer>
							{footerLinkGroups.map((group, index) => (
								<AnimatedContainer
									className="w-full"
									delay={0.1 + index * 0.1}
									key={group.label}
								>
									<div className="mb-10 md:mb-0">
										<h3 className="text-sm capitalize">{group.label}</h3>
										<ul className="mt-4 space-y-2 text-muted-foreground text-sm md:text-xs lg:text-sm">
											{group.links.map((link) => (
												<li key={link.title}>
													<a
														className="inline-flex items-center hover:text-foreground [&_svg]:me-1 [&_svg]:size-4"
														href={link.href}
													>
														{link.icon}
														{link.title}
													</a>
												</li>
											))}
										</ul>
									</div>
								</AnimatedContainer>
							))}
						</div>
						<div className="flex flex-col items-center justify-center gap-2 border-t p-4 text-muted-foreground text-sm md:flex-row">
							<p>
								&copy; {new Date().getFullYear()} Perfu.me, All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

const socialLinks = [
	{
		title: "WhatsApp",
		href: "#",
		icon: <WhatsAppIcon />,
	},
	{
		title: "YouTube",
		href: "#",
		icon: <YoutubeIcon />,
	},
	{
		title: "Facebook",
		href: "#",
		icon: <FacebookIcon />,
	},
	{
		title: "Instagram",
		href: "#",
		icon: <InstagramIcon />,
	},
];

const footerLinkGroups: FooterLinkGroup[] = [
	{
		label: "Social Media",
		links: [
			{ title: "WhatsApp", href: "#" },
			{ title: "YouTube", href: "#" },
			{ title: "Facebook", href: "#" },
			{ title: "Instagram", href: "#" },
		],
	},
	{
		label: "Navigate",
		links: [
			{ title: "Home", href: "#" },
			{ title: "Product Catalog", href: "#" },
			{ title: "About Us", href: "#" },
			{ title: "Contact", href: "#" },
		],
	},
	{
		label: "Legal",
		links: [
			{ title: "Privacy Policy", href: "#" },
			{ title: "Terms of Service", href: "#" },
			{ title: "Licensing", href: "#" },
		],
	},
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	delay?: number;
};

function AnimatedContainer({
	delay = 0.1,
	children,
	...props
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
			transition={{ delay, duration: 0.8 }}
			viewport={{ once: true }}
			whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
			{...props}
		>
			{children}
		</motion.div>
	);
}
