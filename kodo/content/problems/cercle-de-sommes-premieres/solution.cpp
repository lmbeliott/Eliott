#include <iostream>
#include <vector>
using namespace std;

int n;
vector<int> a, cercle;
vector<bool> utilise, premier;

long long placer() {
    if ((int)cercle.size() == n) return premier[cercle.back() + cercle[0]] ? 1 : 0;
    long long total = 0;
    for (int j = 1; j < n; j++) {
        if (!utilise[j] && premier[cercle.back() + a[j]]) {
            utilise[j] = true;
            cercle.push_back(a[j]);
            total += placer();
            cercle.pop_back();
            utilise[j] = false;
        }
    }
    return total;
}

int main() {
    cin >> n;
    a.resize(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // crible jusqu'à 2 000
    premier.assign(2001, true);
    premier[0] = premier[1] = false;
    for (int i = 2; i < 45; i++)
        if (premier[i])
            for (int j = i * i; j <= 2000; j += i) premier[j] = false;
    cercle = {a[0]};                // le premier nombre est fixé : on ne compte qu'une rotation
    utilise.assign(n, false);
    utilise[0] = true;
    cout << placer() << "\n";
    return 0;
}
