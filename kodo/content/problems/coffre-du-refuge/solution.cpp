#include <iostream>
#include <string>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    string chiffres;
    cin >> n >> k >> chiffres;

    string garde;       // les chiffres gardés jusqu'ici (une pile)
    int a_effacer = k;
    for (char c : chiffres) {
        // un chiffre plus grand juste avant c : l'effacer rend le nombre plus petit
        while (a_effacer > 0 && !garde.empty() && garde.back() > c) {
            garde.pop_back();
            a_effacer--;
        }
        garde.push_back(c);
    }
    // s'il reste des chiffres à effacer, on enlève les derniers (les plus grands)
    garde.resize(n - k);
    cout << garde << "\n";
    return 0;
}
