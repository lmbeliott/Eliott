#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

vector<long long> divs;

// façons d'écrire reste (> 1) comme produit de facteurs distincts
// pris parmi divs[i], divs[i + 1], ... (dans l'ordre croissant)
long long compter(long long reste, int i) {
    long long total = 1;                       // reste lui-même, comme dernier facteur
    for (int j = i; divs[j] * divs[j] < reste; j++) {   // il faut encore un facteur plus grand après divs[j]
        if (reste % divs[j] == 0) total += compter(reste / divs[j], j + 1);
    }
    return total;
}

int main() {
    long long n;
    cin >> n;
    // diviseurs de n supérieurs ou égaux à 2, dans l'ordre croissant
    for (long long d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            divs.push_back(d);
            if (d * d != n) divs.push_back(n / d);
        }
    }
    divs.push_back(n);
    sort(divs.begin(), divs.end());
    cout << compter(n, 0) << "\n";
    return 0;
}
