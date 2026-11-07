#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int a, b, k;
vector<int> premiers;

// glouton : on prend le premier nombre premier, puis toujours le plus petit à distance au moins d
bool possible(int d) {
    int pris = 1, idx = 0;
    while (pris < k) {
        idx = lower_bound(premiers.begin() + idx + 1, premiers.end(), premiers[idx] + d) - premiers.begin();
        if (idx == (int)premiers.size()) return false;
        pris++;
    }
    return true;
}

int main() {
    cin >> a >> b >> k;
    // crible d'Ératosthène jusqu'à B
    vector<bool> estPremier(b + 1, true);
    estPremier[0] = false;
    if (b >= 1) estPremier[1] = false;
    for (long long i = 2; i * i <= b; i++)
        if (estPremier[i])
            for (long long j = i * i; j <= b; j += i) estPremier[j] = false;
    for (int p = a; p <= b; p++)
        if (estPremier[p]) premiers.push_back(p);

    if ((int)premiers.size() < k) {
        cout << -1 << "\n";
        return 0;
    }
    int bas = 1, haut = b - a;  // possible(bas) est vrai ; on cherche le plus grand d possible
    while (bas < haut) {
        int milieu = (bas + haut + 1) / 2;
        if (possible(milieu)) bas = milieu;
        else haut = milieu - 1;
    }
    cout << bas << "\n";
    return 0;
}
