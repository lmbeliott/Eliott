#include <iostream>
#include <string>
#include <vector>
using namespace std;

const long long MOD = 1000000007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> sauts(k);
    for (int& s : sauts) cin >> s;
    string glace;  // glace[i - 1] décrit la marche i
    cin >> glace;

    // nb[i] = nombre de façons d'arriver sur la marche i (modulo MOD).
    vector<long long> nb(n + 1, 0);
    nb[0] = 1;
    for (int i = 1; i <= n; i++) {
        if (glace[i - 1] == '#') continue;  // marche verglacée : on n'y pose jamais le pied
        long long total = 0;
        for (int s : sauts) {
            if (s <= i) total += nb[i - s];  // dernier saut de longueur s, depuis la marche i - s
        }
        nb[i] = total % MOD;
    }

    cout << nb[n] << "\n";
    return 0;
}
