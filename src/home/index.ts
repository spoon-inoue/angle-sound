import gsap from 'gsap'
import { qs } from '../scripts/utils'

const angleAlpha = qs<HTMLParagraphElement>('.angle-alpha')
const acceptModal = qs<HTMLDivElement>('.accept')
const accept = qs<HTMLButtonElement>('.accept > button')

const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
	angleAlpha.innerText = `${e.alpha} deg`
}

function hideAcceptModal() {
	gsap.to(acceptModal, {
		opacity: 0,
		duration: 0.3,
		onComplete: () => {
			acceptModal.style.setProperty('display', 'none')
		},
	})
}

const requestDeviceOrientation = async () => {
	hideAcceptModal()

	// https://developer.apple.com/forums/thread/128376
	// https://www.w3.org/TR/orientation-event/#description
	const doe = DeviceOrientationEvent as any
	if (doe && doe.requestPermission && typeof doe.requestPermission === 'function') {
		// after ios13
		const permissionState = await (doe.requestPermission() as Promise<PermissionState>)
		angleAlpha.innerText = permissionState
		if (permissionState === 'granted') {
			window.addEventListener('deviceorientation', handleDeviceOrientation)
		}
	} else {
		// another
		window.addEventListener('deviceorientation', handleDeviceOrientation)
	}
}

// accept.addEventListener('click', () => {
// 	requestDeviceOrientation()
// 	gsap.to(acceptModal, {
// 		opacity: 0,
// 		duration: 0.3,
// 		onComplete: () => {
// 			acceptModal.style.setProperty('display', 'none')
// 		},
// 	})
// })

accept.addEventListener('click', requestDeviceOrientation, false)
