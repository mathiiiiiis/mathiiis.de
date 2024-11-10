document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pc-form');
    const resultDiv = document.getElementById('result');
    const ratingParagraph = document.getElementById('rating');
    const recommendationsDiv = document.getElementById('recommendations');

    const components = {
        cpu: [
            'Intel Core i9-13900K', 'AMD Ryzen 9 7950X', 'Intel Core i7-13700K', 'AMD Ryzen 9 7900X3D',
            'Apple M2 Ultra', 'AMD Threadripper Pro 5995WX', 'Intel Core i5-13600K', 'AMD Ryzen 7 7800X3D',
            'Intel Core i9-12900KS', 'AMD Ryzen 5 7600X', 'Intel Core i5-12400F', 'AMD Ryzen 7 7700',
            'Intel Core i3-12100F', 'AMD Ryzen 5 5600G', 'Intel Core i9-10980XE', 'Intel Core i7-12700KF',
            'AMD Ryzen 7 5700G', 'Intel Core i9-11900K', 'AMD Ryzen 9 5900X', 'Intel Xeon W-3300'
        ],
        gpu: [
            'NVIDIA GeForce RTX 4090', 'AMD Radeon RX 7900 XTX', 'NVIDIA GeForce RTX 4080', 'AMD Radeon RX 7900 XT',
            'NVIDIA GeForce RTX 4070 Ti', 'NVIDIA GeForce RTX 4060 Ti', 'AMD Radeon RX 7800 XT', 'NVIDIA GeForce RTX 3090 Ti',
            'AMD Radeon RX 6800 XT', 'NVIDIA GeForce RTX 3080', 'NVIDIA GeForce RTX 3070', 'AMD Radeon RX 6700 XT',
            'NVIDIA GeForce RTX 3060 Ti', 'AMD Radeon RX 6600 XT', 'NVIDIA GeForce RTX 2060', 'AMD Radeon RX 5600 XT',
            'NVIDIA GeForce RTX 3050', 'Intel Arc A770', 'AMD Radeon RX 6500 XT', 'NVIDIA Tesla A100'
        ],
        ram: [
            'G.Skill Trident Z5 RGB DDR5-6000 CL30', 'Corsair Dominator Platinum RGB DDR5-6200',
            'Kingston Fury Renegade DDR5-6400', 'Corsair Vengeance DDR5-6000', 'G.Skill Ripjaws S5 DDR5-5600',
            'TeamGroup T-Force Delta RGB DDR5-6600', 'Crucial DDR5-4800', 'Kingston Fury Beast DDR5-5200',
            'ADATA XPG Lancer DDR5-6000', 'Patriot Viper Steel DDR4-4400', 'Corsair Vengeance LPX DDR4-3600',
            'G.Skill Trident Z Neo DDR4-3600', 'TeamGroup T-Force Dark Z DDR4-3600', 'Kingston HyperX Predator DDR4-3200',
            'Crucial Ballistix DDR4-3200', 'Corsair Dominator Platinum RGB DDR4-3600', 'Patriot Viper 4 Blackout DDR4-3600',
            'TeamGroup T-Force Vulcan Z DDR4-3200', 'G.Skill Ripjaws V DDR4-3600', 'Crucial CT2K16G4DFD8266 DDR4-2666'
        ],
        storage: [
            // NVMe SSDs
            'Samsung 990 Pro 2TB NVMe', 'Western Digital Black SN850X', 'Sabrent Rocket 4 Plus',
            'Crucial P5 Plus', 'Seagate FireCuda 530', 'Corsair MP600 Pro XT', 'Kingston KC3000',
            'ADATA XPG Gammix S70 Blade', 'WD Blue SN570', 'Lexar NM800 Pro', 'Patriot Viper VP4300',
            'Samsung 980 Pro 1TB', 'SK hynix Platinum P41', 'TeamGroup MP34', 'WD Black SN750',
            'Silicon Power US70', 'MSI Spatium M480', 'PNY XLR8 CS3040', 'Gigabyte AORUS Gen4 7000s',
            'Sabrent Rocket Q4',
            // SATA SSDs
            'Samsung 870 EVO', 'Crucial MX500', 'WD Blue 3D NAND', 'SanDisk Ultra 3D', 'Kingston A400',
            'Seagate Barracuda SSD', 'SK hynix Gold S31', 'ADATA SU800', 'Patriot Burst Elite', 'Pioneer APS-SL3',
            // HDDs
            'Seagate IronWolf Pro', 'Western Digital Red Pro', 'Toshiba X300', 'Seagate BarraCuda Pro',
            'WD Black Performance HDD', 'Toshiba N300', 'Western Digital Ultrastar DC', 'Seagate Exos X20',
            'Seagate SkyHawk AI', 'WD Gold Enterprise HDD'
        ]
    };

    for (const [key, value] of Object.entries(components)) {
        autocomplete(document.getElementById(key), value);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cpu = document.getElementById('cpu').value;
        const ram = document.getElementById('ram').value;
        const storage = document.getElementById('storage').value;
        const gpu = document.getElementById('gpu').value;

        const rating = ratePC(cpu, ram, storage, gpu);
        displayResult(rating);
    });

    function autocomplete(inp, arr) {
        let currentFocus;
        inp.addEventListener("input", function(e) {
            let a, b, i, val = this.value;
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("click", function(e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    function ratePC(cpu, ram, storage, gpu) {
        return {
            cpu: rateComponent(cpu, 'cpu'),
            ram: rateComponent(ram, 'ram'),
            storage: rateComponent(storage, 'storage'),
            gpu: rateComponent(gpu, 'gpu')
        };
    }

    function rateComponent(component, type) {
        const lowerComponent = component.toLowerCase();
        let rating, recommendation;

        switch (type) {
            case 'cpu':
                if (lowerComponent.includes('13900k') || lowerComponent.includes('7950x')) {
                    rating = 'Excellent';
                    recommendation = 'Top-tier CPU, exceptional for heavy tasks and gaming.';
                } else if (lowerComponent.includes('13700k') || lowerComponent.includes('7900x3d') || lowerComponent.includes('threadripper')) {
                    rating = 'Very Good';
                    recommendation = 'High-end CPU, great for demanding tasks and high-fps gaming.';
                } else if (lowerComponent.includes('13600k') || lowerComponent.includes('7800x3d') || lowerComponent.includes('12900k')) {
                    rating = 'Good';
                    recommendation = 'Strong CPU, suitable for most tasks including gaming and content creation.';
                } else if (lowerComponent.includes('12600k') || lowerComponent.includes('5600x') || lowerComponent.includes('7600x')) {
                    rating = 'Average';
                    recommendation = 'Decent CPU for everyday tasks and gaming. Consider upgrading for heavy workloads.';
                } else {
                    rating = 'Below Average';
                    recommendation = 'Basic CPU. Upgrade recommended for better performance.';
                }
                break;
            case 'ram':
                if (lowerComponent.includes('ddr5')) {
                    if (parseInt(lowerComponent.match(/\d+/)) >= 5600) {
                        rating = 'Excellent';
                        recommendation = 'High-speed DDR5 RAM, perfect for demanding applications and future-proofing.';
                    } else {
                        rating = 'Very Good';
                        recommendation = 'DDR5 RAM provides good performance. Consider higher speeds for maximum benefit.';
                    }
                } else {
                    const ramSize = parseInt(lowerComponent.match(/\d+/));
                    if (ramSize >= 32) {
                        rating = 'Good';
                        recommendation = 'Ample DDR4 RAM for most tasks. Consider upgrading to DDR5 for future-proofing.';
                    } else if (ramSize >= 16) {
                        rating = 'Average';
                        recommendation = 'Sufficient DDR4 RAM for basic tasks. Consider upgrading capacity or to DDR5 for better performance.';
                    } else {
                        rating = 'Below Average';
                        recommendation = 'Low RAM capacity. Upgrade recommended for better multitasking and overall performance.';
                    }
                }
                break;
            case 'storage':
                if (lowerComponent.includes('nvme')) {
                    if (lowerComponent.includes('990 pro') || lowerComponent.includes('firecuda') || lowerComponent.includes('mp600')) {
                        rating = 'Excellent';
                        recommendation = 'Top-tier NVMe SSD. Exceptional speed for boot times and file operations.';
                    } else {
                        rating = 'Very Good';
                        recommendation = 'Fast NVMe SSD storage. Great for quick boot times and application loading.';
                    }
                } else if (lowerComponent.includes('ssd')) {
                    rating = 'Good';
                    recommendation = 'SSD provides good performance. Consider NVMe SSD for even faster speeds.';
                } else {
                    rating = 'Below Average';
                    recommendation = 'HDD detected. Strongly recommend upgrading to an SSD for significantly better performance.';
                }
                break;
            case 'gpu':
                if (lowerComponent.includes('rtx 4090') || lowerComponent.includes('rx 7900 xtx')) {
                    rating = 'Excellent';
                    recommendation = 'Top-tier GPU, exceptional for 4K gaming and intensive GPU tasks.';
                } else if (lowerComponent.includes('rtx 4080') || lowerComponent.includes('rx 7900 xt') || lowerComponent.includes('rtx 4070 ti')) {
                    rating = 'Very Good';
                    recommendation = 'High-end GPU, great for 4K gaming and GPU-intensive workloads.';
                } else if (lowerComponent.includes('rtx 3080') || lowerComponent.includes('rx 6800 xt') || lowerComponent.includes('rtx 3070')) {
                    rating = 'Good';
                    recommendation = 'Capable GPU for 1440p/4K gaming and moderate workloads. Solid performance in most scenarios.';
                } else if (lowerComponent.includes('rtx 3060') || lowerComponent.includes('rx 6700 xt') || lowerComponent.includes('rtx 2060')) {
                    rating = 'Average';
                    recommendation = 'Mid-range GPU. Good for 1080p/1440p gaming. Consider upgrading for 4K or newer games.';
                } else {
                    rating = 'Below Average';
                    recommendation = 'Entry-level or older GPU. Upgrade recommended for modern games and GPU-intensive tasks.';
                }
                break;
        }

        return { component, rating, recommendation };
    }

    function displayResult(ratings) {
        let overallScore = 0;
        let resultHTML = '';

        for (const [component, rating] of Object.entries(ratings)) {
            let scoreContribution = 0;
            switch (rating.rating) {
                case 'Excellent': scoreContribution = 25; break;
                case 'Very Good': scoreContribution = 22; break;
                case 'Good': scoreContribution = 20; break;
                case 'Average': scoreContribution = 15; break;
                case 'Below Average': scoreContribution = 10; break;
            }
            overallScore += scoreContribution;

            resultHTML += `
                <div class="component-rating animate__animated animate__fadeInUp" style="animation-delay: ${Object.keys(ratings).indexOf(component) * 0.1}s">
                    <h3>${component.toUpperCase()}: ${rating.rating}</h3>
                    <p>${rating.component}</p>
                    <p>${rating.recommendation}</p>
                </div>
            `;
        }

        let overallRating, emoji;
        if (overallScore >= 90) {
            overallRating = "Excellent";
            emoji = "🚀";
        } else if (overallScore >= 80) {
            overallRating = "Very Good";
            emoji = "💪";
        } else if (overallScore >= 70) {
            overallRating = "Good";
            emoji = "👍";
        } else if (overallScore >= 50) {
            overallRating = "Average";
            emoji = "🤔";
        } else {
            overallRating = "Below Average";
            emoji = "😕";
        }

        ratingParagraph.textContent = `Overall: ${overallRating} ${emoji} (Score: ${overallScore}/100)`;
        recommendationsDiv.innerHTML = resultHTML;
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('animate__fadeIn');
        
        ratingParagraph.classList.add('animate__pulse');
    }
});