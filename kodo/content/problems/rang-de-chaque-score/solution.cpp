#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
#include <functional>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> scores(n);
    for (int i = 0; i < n; i++) cin >> scores[i];

    // Du meilleur score au moins bon.
    vector<int> tries = scores;
    sort(tries.begin(), tries.end(), greater<int>());

    // rang[s] = 1 + nombre de scores strictement meilleurs que s :
    // c'est la position (en comptant à partir de 1) de la première apparition de s dans la liste triée.
    map<int, int> rang;
    for (int i = 0; i < n; i++) {
        if (rang.count(tries[i]) == 0) rang[tries[i]] = i + 1;
    }

    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << rang[scores[i]];
    }
    cout << "\n";
    return 0;
}
