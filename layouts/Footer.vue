<template>
	<div>
		<div class="container mx-auto flex justify-between items-center">
			<div>
				<p class="text-sm">© 2025 Pascale Canal. Tous droits réservés.</p>
				<p class="text-sm">
					Site web par
					<NuxtLink
						to="https://www.remycanal.me"
						target="_blank"
						class="underline">
						Rémy Canal
					</NuxtLink>
				</p>
			</div>
			<div>
				<NuxtLink
					to="https://www.facebook.com/pascalecanalpeintre"
					target="_blank"
					class="hover:text-gold transition-colors">
					Facebook
				</NuxtLink>
				<NuxtLink
					to="https://www.instagram.com/pascalecanalpeintre"
					target="_blank"
					class="hover:text-gold transition-colors ml-5">
					Instagram
				</NuxtLink>
				<NuxtLink
					to="https://www.linkedin.com/pascalecanalpeintre"
					target="_blank"
					class="hover:text-gold transition-colors ml-5">
					LinkedIn
				</NuxtLink>
			</div>
			<div>
				<NuxtLink to="faq" class="hover:text-gold transition-colors">
					FAQ
				</NuxtLink>

				<NuxtLink
					to="mentions-legales"
					class="hover:text-gold transition-colors ml-5">
					Mentions légales
				</NuxtLink>

				<NuxtLink
					to="politique-de-confidentialite"
					class="hover:text-gold transition-colors ml-5">
					Politique de confidentialité
				</NuxtLink>

				<NuxtLink to="cgu" class="hover:text-gold transition-colors ml-5">
					CGU
				</NuxtLink>
			</div>
		</div>
		<div
			class="flex justify-between gap-x-1 items-start uppercase pointer-events-none font-apercuBold text-center text-[600px] leading-[0px] mt-70">
			<span>C</span>
			<span>a</span>
			<span>n</span>
			<span>a</span>
			<span>l</span>
		</div>
	</div>
</template>
